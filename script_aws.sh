#!/bin/bash

set -e

exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

# =====================================================
# 🔧 CONFIGURATION
# =====================================================

DB_HOST="<YOUR_RDS_ENDPOINT>"
DB_USER="<YOUR_DB_USERNAME>"
DB_PASS="<YOUR_DB_PASSWORD>"

JWT_KEY="<YOUR_JWT_SECRET>"
SALT_KEY="<YOUR_SALT_SECRET>"

EMAIL_ID="<YOUR_EMAIL>"
EMAIL_PASS="<YOUR_EMAIL_APP_PASSWORD>"

# =====================================================
# 🛠️ SYSTEM SETUP
# =====================================================

cd /home/ubuntu

apt update -y

timedatectl set-timezone Asia/Kolkata

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

apt install -y nodejs
apt install -y npm git
apt install -y mysql-client-core-8.0

# Install RabbitMQ
DEBIAN_FRONTEND=noninteractive apt install -y rabbitmq-server

systemctl enable rabbitmq-server
systemctl start rabbitmq-server

# Install PM2
npm install -g pm2

# =====================================================
# 🗄️ CREATE DATABASES
# =====================================================

mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS auth_db;"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS booking_db;"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS flights_search_db;"

# =====================================================
# ⚙️ HELPER FUNCTION
# =====================================================

create_config_json() {

    local DB_NAME=$1
    local TARGET_DIR=$2

    mkdir -p $TARGET_DIR/src/config

    cat <<EOF > $TARGET_DIR/src/config/config.json
{
  "development": {
    "username": "$DB_USER",
    "password": "$DB_PASS",
    "database": "$DB_NAME",
    "host": "$DB_HOST",
    "dialect": "mysql",
    "timezone": "+05:30"
  }
}
EOF
}

# =====================================================
# 🚀 API GATEWAY
# =====================================================

cd /home/ubuntu

git clone https://github.com/Sundaram-65/API_Gateway.git

cd API_Gateway

npm install

cat <<EOF > .env
PORT=3004
flightCityServicePORT=3000
authServicePORT=3001
bookingServicePORT=3002
EOF

pm2 start src/index.js --name API-Gateway

# =====================================================
# 🔐 AUTH SERVICE
# =====================================================

cd /home/ubuntu

git clone https://github.com/Sundaram-65/Auth_Service.git

cd Auth_Service

npm install

cat <<EOF > .env
PORT=3001
SALT=$SALT_KEY
JWT_KEY=$JWT_KEY
DB_SYNC=true
EOF

create_config_json "auth_db" "/home/ubuntu/Auth_Service"

npx sequelize db:migrate \
--config src/config/config.json \
--migrations-path src/migrations

pm2 start src/index.js --name Auth-Service

# =====================================================
# ✈️ FLIGHT SERVICE
# =====================================================

cd /home/ubuntu

git clone https://github.com/Sundaram-65/FlightsAndSearchService.git

cd FlightsAndSearchService

npm install

cat <<EOF > .env
PORT=3000
DB_SYNC=true
EOF

create_config_json "flights_search_db" "/home/ubuntu/FlightsAndSearchService"

npx sequelize db:migrate \
--config src/config/config.json \
--migrations-path src/migrations

pm2 start src/index.js --name Flight-Service

# =====================================================
# 📦 BOOKING SERVICE
# =====================================================

cd /home/ubuntu

git clone https://github.com/Sundaram-65/Booking_Service.git

cd Booking_Service

npm install

cat <<EOF > .env
PORT=3002
DB_SYNC=true

FLIGHT_SERVICE_PATH=http://localhost:3000
USER_SERVICE_PATH=http://localhost:3001

MESSAGE_BROKER_URL=amqp://localhost

EXCHANGE_NAME=AIRLINE_BOOKING
REMINDER_BINDING_KEY=REMINDER_SERVICE
EOF

create_config_json "booking_db" "/home/ubuntu/Booking_Service"

npx sequelize db:migrate \
--config src/config/config.json \
--migrations-path src/migrations

pm2 start src/index.js --name Booking-Service

# =====================================================
# 🔔 REMINDER SERVICE
# =====================================================

cd /home/ubuntu

git clone https://github.com/Sundaram-65/Reminder_Service.git

cd Reminder_Service

npm install

cat <<EOF > .env
PORT=3003

EMAIL_ID=$EMAIL_ID
EMAIL_PASS=$EMAIL_PASS

MESSAGE_BROKER_URL=amqp://localhost

EXCHANGE_NAME=AIRLINE_BOOKING
REMINDER_BINDING_KEY=REMINDER_SERVICE
EOF

create_config_json "booking_db" "/home/ubuntu/Reminder_Service"

npx sequelize db:migrate \
--config src/config/config.json \
--migrations-path src/migrations

pm2 start src/index.js --name Reminder-Service

# =====================================================
# 💾 SAVE PM2
# =====================================================

pm2 save

pm2 startup systemd -u ubuntu --hp /home/ubuntu

# =====================================================
# 🩺 HEALTH CHECKS
# =====================================================

sleep 15

curl localhost:3000 || true
curl localhost:3001 || true
curl localhost:3002 || true
curl localhost:3003 || true
curl localhost:3004/home || true

# =====================================================
# ✅ DEPLOYMENT COMPLETE
# =====================================================

echo "🚀 Airline Microservices Deployment Completed Successfully"
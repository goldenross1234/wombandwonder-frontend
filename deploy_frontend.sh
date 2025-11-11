#!/data/data/com.termux/files/usr/bin/bash

# Set frontend path
FRONTEND_PATH="/data/data/com.termux/files/home/wombandwonder/wombandwonder-frontend"

echo ">>> Entering frontend directory..."
cd "$FRONTEND_PATH" || exit 1

echo ">>> Installing npm dependencies..."
npm install

echo ">>> Building React app..."
npm run build

echo ">>> Installing 'serve' globally (for static hosting)..."
npm install -g serve

echo ">>> Starting frontend using PM2..."
pm2 delete frontend 2>/dev/null
pm2 start "serve -s build -l tcp://0.0.0.0:3000" --name frontend

echo ">>> Saving PM2 process list..."
pm2 save

echo ">>> Frontend is now running on port 3000!"
echo ">>> Access it via: http://<YOUR_TABLET_IP>:3000"

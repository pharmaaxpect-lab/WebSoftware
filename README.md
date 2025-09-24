# WebSofware

# Git data update command
git commit -m "Added frontend views, public assets, and updated package.json"
git push origin main

# VPS per git hub se code update karna ho 

git pull origin main

# jab bhi git gub se new code push karne ke baad VPS per ye command run karni hogi

cd /root/WebSoftware
git reset --hard
git pull origin main

cd /root/WebSoftware/backend
npm install --production
pm2 restart caller-backend --update-env

cd /root/WebSoftware/frontend
npm install --production
pm2 restart caller-frontend --update-env.

pm2 save


# Fix karne ka step-by-step process -> git hub se VPS per push karne ke liye
cd ~/WebSoftware
rm -rf frontend/node_modules
rm -rf backend/node_modules

git reset --hard
git pull origin main

cd ~/WebSoftware/frontend
npm install

cd ~/WebSoftware/backend
npm install

pm2 restart all    -> # Server restart karo

# install 
npm install express mongoose multer bcryptjs dotenv
npm install --save-dev nodemon

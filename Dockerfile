# 第一阶段：构建应用
FROM registry.cn-hangzhou.aliyuncs.com/hatlonely/node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 第二阶段：部署应用
FROM registry.cn-hangzhou.aliyuncs.com/hatlonely/nginx:stable-alpine

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建结果到Nginx的静态文件目录
COPY --from=build /app/build /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]

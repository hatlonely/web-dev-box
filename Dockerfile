# 第一阶段：构建应用
FROM registry.cn-hangzhou.aliyuncs.com/hatlonely/node:23-alpine AS build

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
FROM registry.cn-hangzhou.aliyuncs.com/hatlonely/node:23-alpine

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV production

# 复制package.json和package-lock.json
COPY package.json package-lock.json ./

# 安装生产环境依赖
RUN npm ci --omit=dev

# 从构建阶段复制Next.js构建结果
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./

# 暴露3000端口
EXPOSE 3000

# 启动Next.js应用
CMD ["npm", "start"]

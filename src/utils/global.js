const HOST = 'http://localhost';
const SOCKET_PORT = '8090';
const HTTP_PORT = '8098';
export default {
  //页面文件与后台springBoot使用同一个服务时，打包时让host与port均设置为空，请求会使用后台服务的host与port
  SOCKET_URL: HOST + ':' + SOCKET_PORT,
  HTTP_URL: HOST + ':' + HTTP_PORT,
};

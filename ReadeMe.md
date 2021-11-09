# 使用Node代理请求，达到限速的目的
目前用在Android真机调试时，精准限制请求带宽。

暂没有找到好的方法达到以上目的，如果有请告知我谢谢。

```
// use
npm install
node index.js

// 如浏览器输入网址：
//     http://127.0.0.1:8091/test/11.jpg?host=cdnv.vincicar.net
// 将会被代理到:
//    http://cdnv.vincicar.net/test/11.jpg
// 此刻这张jpg将以1kb/s的龟速呈现在你的浏览器

// ThrottleGroup({ rate: 1 * 1024 }) 代表限速1KB/S

// 附上Java工具方法：

getBrandLimitUrl("http://cdnv.vincicar.net/test/11.jpg")

public static String getBrandLimitUrl(String url) {
    try {
        Uri uri = Uri.parse(url);
        String aimHost = uri.getHost();
        String newUrl = "http://192.168.31.189:8091" + uri.getPath();
        String aim = URLEncoder.encode(
                url.indexOf("https") == -1 ? "http://" : "https://" + aimHost,
                java.nio.charset.StandardCharsets.UTF_8.toString()
        );
        if (uri.getQuery() == null) {
            if (newUrl.endsWith("?")) {
                newUrl = newUrl.substring(0, newUrl.length() - 1);
            }
            newUrl += "?rHost=" + aim;
        } else {
            newUrl += "&" + "rHost=" + aim;
        }
        return newUrl;
    } catch (Exception e) {
        return "";
    }
}
```
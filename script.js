// 解析URL参数
function getURLParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
        // URLSearchParams已经自动解码了，不需要再调用decodeURIComponent
        params[key] = value;
    }
    return params;
}

// 解析Markdown内容
function parseMarkdown(text) {
    if (!text) return '';
    // 设置marked选项
    marked.setOptions({
        breaks: true,
        gfm: true,
        tables: true,
        smartLists: true,
        smartypants: true
    });
    return marked.parse(text);
}

// 显示解析结果
function displayResult(text) {
    const outputDiv = document.getElementById('markdownOutput');
    outputDiv.innerHTML = parseMarkdown(text);
}

// 初始化页面
function init() {
    // 获取URL参数
    const params = getURLParams();
    
    // 如果有text参数，使用它并解析
    if (params.text) {
        displayResult(params.text);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 支持通过POST请求接收参数的说明：
// 由于这是静态HTML页面，直接处理服务器端POST请求需要配合后端服务器
// 您可以将此页面部署到支持PHP的服务器，并创建一个简单的PHP脚本：
/*
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['text'])) {
    $text = $_POST['text'];
    // 将内容作为URL参数重定向回页面
    header('Location: index.html?text=' . urlencode($text));
    exit;
}
?>
*/
// 或者使用Node.js等其他后端技术来处理POST请求
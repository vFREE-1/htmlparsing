// 解析URL参数
function getURLParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
        // 为了确保正确处理各种编码情况，我们再次进行解码
        try {
            params[key] = decodeURIComponent(value);
        } catch (e) {
            // 如果解码失败，使用原始值
            params[key] = value;
        }
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

// 将JSON数据转换为Markdown格式
function jsonToMarkdown(jsonData) {
    let markdown = '';
    
    // 遍历JSON数组中的每个文章对象
    jsonData.forEach(article => {
        markdown += '------\n';
        // 遍历文章对象的每个属性
        for (const [key, value] of Object.entries(article)) {
            // 清理值中的可能存在的反引号
            const cleanedValue = String(value).replace(/`/g, '');
            markdown += `- ${key}：${cleanedValue}\n`;
        }
        markdown += '------\n\n';
    });
    
    return markdown;
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
    
    // 如果有json参数，使用它并解析
    if (params.json) {
        try {
            // 解析JSON数据
            const jsonData = JSON.parse(params.json);
            // 转换为Markdown格式
            const markdownText = jsonToMarkdown(jsonData);
            // 显示结果
            displayResult(markdownText);
        } catch (error) {
            displayResult(`解析JSON数据时发生错误：${error.message}`);
        }
    }
    // 如果有text参数，使用它并解析
    else if (params.text) {
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

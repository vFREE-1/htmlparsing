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

// 在长URL中插入零宽空格，以强制浏览器在需要时换行
function insertZeroWidthSpaces(text) {
    if (typeof text !== 'string') return text;
    
    // 匹配URL模式
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    return text.replace(urlPattern, (url) => {
        // 如果URL过长（超过50个字符），在适当位置插入零宽空格
        if (url.length > 50) {
            // 每25个字符插入一个零宽空格
            return url.replace(/(.{25})/g, '$1\u200B');
        }
        return url;
    });
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
            // 在长URL中插入零宽空格
            const processedValue = insertZeroWidthSpaces(cleanedValue);
            markdown += `- ${key}：${processedValue}\n`;
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

// 检查并处理POST请求
function checkPostRequest() {
    // 检查是否有表单数据
    const postJsonInput = document.getElementById('postJsonInput');
    if (postJsonInput && postJsonInput.value) {
        return postJsonInput.value;
    }
    return null;
}

// 检查并处理localStorage数据
function checkLocalStorage() {
    if (localStorage.getItem('jsonData')) {
        const jsonData = localStorage.getItem('jsonData');
        // 清除localStorage中的数据，避免下次自动加载
        localStorage.removeItem('jsonData');
        return jsonData;
    }
    return null;
}

// 初始化页面
function init() {
    let jsonDataStr = null;
    let textData = null;
    
    // 1. 首先检查URL参数（GET请求）
    const params = getURLParams();
    
    // 2. 检查POST请求数据
    const postJson = checkPostRequest();
    
    // 3. 检查localStorage数据
    const localStorageJson = checkLocalStorage();
    
    // 确定使用哪个数据源
    if (params.json) {
        jsonDataStr = params.json;
    } else if (postJson) {
        jsonDataStr = postJson;
    } else if (localStorageJson) {
        jsonDataStr = localStorageJson;
    } else if (params.text) {
        textData = params.text;
    }
    
    // 如果有json数据，使用它并解析
    if (jsonDataStr) {
        try {
            // 解析JSON数据
            const jsonData = JSON.parse(jsonDataStr);
            // 转换为Markdown格式
            const markdownText = jsonToMarkdown(jsonData);
            // 显示结果
            displayResult(markdownText);
        } catch (error) {
            displayResult(`解析JSON数据时发生错误：${error.message}`);
        }
    }
    // 如果有text参数，使用它并解析
    else if (textData) {
        displayResult(textData);
    }
}

// 提供外部调用接口，用于传递JSON数据
function handleJsonData(jsonData) {
    try {
        // 如果是字符串，先解析
        const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        // 转换为Markdown格式
        const markdownText = jsonToMarkdown(parsedData);
        // 显示结果
        displayResult(markdownText);
    } catch (error) {
        displayResult(`解析JSON数据时发生错误：${error.message}`);
    }
}

// 保存JSON数据到localStorage并跳转到当前页面
function saveJsonToLocalStorageAndRedirect(jsonData) {
    localStorage.setItem('jsonData', typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData));
    window.location.href = window.location.pathname;
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

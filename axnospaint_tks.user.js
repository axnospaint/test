// ==UserScript==
// @name         AXNOS_Paint_UserScript_TKS
// @namespace    https://com.nicovideo.jp/community/co1128854
// @version      1.99.21
// @description  AXNOS Paint UserScript
// @author       AXNOS
// @match        https://dic.nicovideo.jp/p/tegaki/*
// @require      https://github.com/axnospaint/text/raw/main/lib/axnospaint.min.js
// @grant        none
// @updateURL    https://github.com/axnospaint/text/raw/main/axnospaint_tks.user.js
// @downloadURL  https://github.com/axnospaint/text/raw/main/axnospaint_tks.user.js
// ==/UserScript==

var isExec = false;
var isAXP = false;
var axp;
var buttonText = [
    'AXNOS Paintに切り替える',
    'HTML5版お絵カキコに切り替える',
];
var html5canvas;
var html5canvas_ctx;

// AXNOS Paintを起動するボタンを画面に追加する
if (!document.getElementById('button_exec_axnospaint')) {
    document.body.insertAdjacentHTML('afterbegin',
        `
        <div id="axp-header">
        <button id="button_exec_axnospaint" type="button">AXNOS Paintに切り替える</button>
        <button id="button_exec_drawcanvas" type="button" style="display:none">HTML5版キャンバスに画像を転送する</button>
        </div>
        `
    );
    document.getElementById('button_exec_drawcanvas').onclick = () => {
        let axpcanvas = document.getElementById('axp-canvas-maincanvas');
        html5canvas_ctx.globalCompositeOperation = 'source-over';
        html5canvas_ctx.globalAlpha = 1;
        html5canvas_ctx.drawImage(axpcanvas, 0, 0);
        swapPaint();
    }
    // 起動ボタンが押された時の処理
    document.getElementById('button_exec_axnospaint').onclick = () => {
        if (isExec) {
            swapPaint();
            return;
        }

        // 元のHTMLを削除
        //document.body.innerHTML = '';
        html5canvas = document.getElementById('OImgBlog');
        html5canvas_ctx = html5canvas.getContext('2d');

        document.querySelector('.Wrapper').style.display = 'none';
        document.querySelector('#PalletEdit').style.display = 'none';
        document.querySelector('#AutoSave').style.display = 'none';

        // AXNOS Paint用のHTMLの生成
        createHTML();

        // AXNOS Paint起動
        axp = new AXNOSPaint({
            paintBodyId: 'axnospaint_body',
            url_oekaki: 'https://dic.nicovideo.jp/oekaki/',
            useSameBBSCheck: true,
            executionEnvironment: 'USERSCRIPT',
            restrictPost: true,
            headerText: document.getElementsByTagName('title')[0].textContent,
        });
        isExec = true;
        isAXP = true;
        document.getElementById('button_exec_axnospaint').textContent = buttonText[1];
        document.getElementById('button_exec_drawcanvas').style.display = '';
    };

}

function swapPaint() {
    if (isAXP) {
        // HTML5版に切り替え
        axp.off();

        document.querySelector('.Wrapper').style.display = '';
        document.querySelector('#PalletEdit').style.display = '';
        document.querySelector('#AutoSave').style.display = '';
        isAXP = false;
        document.getElementById('button_exec_axnospaint').textContent = buttonText[0];
        document.getElementById('button_exec_drawcanvas').style.display = 'none';
    } else {
        // AXNOS Paintに切り替え
        axp.on();

        document.querySelector('.Wrapper').style.display = 'none';
        document.querySelector('#PalletEdit').style.display = 'none';
        document.querySelector('#AutoSave').style.display = 'none';
        isAXP = true;
        document.getElementById('button_exec_axnospaint').textContent = buttonText[1];
        document.getElementById('button_exec_drawcanvas').style.display = '';
    }
}

function createHTML() {
    // AXNOS Paint用のHTMLの生成
    document.getElementById('axp-header').insertAdjacentHTML('afterend',
        `<div id="axnospaint_body"></div>`
    );
}
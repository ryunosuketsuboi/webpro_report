"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');

// 投稿送信
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value.trim();
    const message = document.querySelector('#message').value.trim();

    if (!name || !message) {
        alert('名前とメッセージを入力してください。');
        return;
    }

    const params = {
        method: "POST",
        body: 'action=post&name=' + encodeURIComponent(name) + '&message=' + encodeURIComponent(message),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    fetch("/post", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            document.querySelector('#message').value = "";
            checkNewPosts(); // 投稿後に新しい投稿を確認
        })
        .catch(error => console.error(error));
});

// 投稿チェック
document.querySelector('#check').addEventListener('click', () => checkNewPosts());

// 投稿検索
document.querySelector('#search').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const posts = document.querySelectorAll('.cover');
    posts.forEach(post => {
        const content = post.textContent.toLowerCase();
        post.style.display = content.includes(keyword) ? '' : 'none';
    });
});

function checkNewPosts() {
    const params = {
        method: "POST",
        body: 'action=check',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    fetch("/check", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            if (number !== response.number) fetchNewPosts();
        })
        .catch(error => console.error(error));
}

function fetchNewPosts() {
    const params = {
        method: "POST",
        body: 'action=read&start=' + number,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    fetch("/read", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            number += response.messages.length;
            response.messages.forEach(addPost);
        })
        .catch(error => console.error(error));
}

function addPost(post) {
    const cover = document.createElement('div');
    cover.className = 'cover';

    const nameArea = document.createElement('span');
    nameArea.className = 'name';
    nameArea.innerText = post.name;

    const mesArea = document.createElement('span');
    mesArea.className = 'mes';
    mesArea.innerText = post.message;

    const timestampArea = document.createElement('span');
    timestampArea.className = 'timestamp';
    timestampArea.innerText = post.timestamp;

    const editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.innerText = '編集';
    editButton.addEventListener('click', () => editPost(post.id, mesArea));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.innerText = '削除';
    deleteButton.addEventListener('click', () => deletePost(post.id, cover));

    cover.append(nameArea, mesArea, timestampArea, editButton, deleteButton);
    bbs.appendChild(cover);
}

function editPost(id, mesArea) {
    const newMessage = prompt('新しいメッセージを入力してください:', mesArea.innerText);
    if (!newMessage) return;

    const params = {
        method: "POST",
        body: 'action=edit&id=' + id + '&message=' + encodeURIComponent(newMessage),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    fetch("/edit", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            mesArea.innerText = newMessage;
        })
        .catch(error => console.error(error));
}

function deletePost(id, cover) {
    const params = {
        method: "POST",
        body: 'action=delete&id=' + id,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    fetch("/delete", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            cover.remove();
        })
        .catch(error => console.error(error));
}

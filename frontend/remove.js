// const BACKEND_API = 'http://81.177.136.42:8000';
const BACKEND_API = 'https://veerutility.ru';
const itemsContainer = document.getElementById('itemsContainer');
const result = document.getElementById('result');

const modal = document.getElementById('confirmModal');
const btnYes = document.getElementById('confirmYes');
const btnNo = document.getElementById('confirmNo');

let deleteId = null;

async function loadItems() {
    itemsContainer.innerHTML = 'Загрузка товаров...';
    result.textContent = '';
    try {
        const res = await fetch(`${BACKEND_API}/items/`);
        if (!res.ok) throw new Error('Ошибка при загрузке товаров: ' + res.status);
        const items = await res.json();
        if (items.length === 0) {
            itemsContainer.innerHTML = '<p>Товары не найдены.</p>';
            return;
        }
        renderItems(items);
    } catch (error) {
        itemsContainer.innerHTML = '';
        result.textContent = error.message;
    }
}

function renderItems(items) {
    itemsContainer.innerHTML = '';
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'items__item';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'items__info';

        infoDiv.innerHTML = `
        <div class="items__title">${item.title}</div>
        <div class="items__details">
          Цена: <strong>${item.price} ₽</strong><br />
          Пол: ${item.gender}<br />
          Описание: ${item.description || '-'}
        </div>
      `;

        const imagesDiv = document.createElement('div');
        imagesDiv.className = 'items__images';

        if (item.images && item.images.length) {
            item.images.forEach(imgUrl => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = 'Изображение товара';
                img.className = 'items__image';
                imagesDiv.appendChild(img);
            });
        } else {
            imagesDiv.textContent = 'Изображений нет';
        }

        infoDiv.appendChild(imagesDiv);

        const btn = document.createElement('button');
        btn.className = 'items__btn';
        btn.textContent = 'Удалить';
        btn.onclick = () => openConfirmModal(item.id);

        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(btn);

        itemsContainer.appendChild(itemDiv);
    });
}

function openConfirmModal(id) {
    deleteId = id;
    modal.setAttribute('aria-hidden', 'false');
}

function closeConfirmModal() {
    deleteId = null;
    modal.setAttribute('aria-hidden', 'true');
}

async function deleteItem(id) {
    result.textContent = '';
    try {
        const res = await fetch(`${BACKEND_API}/items/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error(`Ошибка при удалении: ${res.status}`);
        result.style.color = 'green';
        result.textContent = 'Товар успешно удалён!';
        loadItems();
    } catch (error) {
        result.style.color = 'red';
        result.textContent = error.message;
    }
}

btnYes.addEventListener('click', () => {
    if (deleteId !== null) {
        deleteItem(deleteId);
    }
    closeConfirmModal();
});
btnNo.addEventListener('click', closeConfirmModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeConfirmModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeConfirmModal();
    }
});

document.addEventListener('DOMContentLoaded', loadItems);

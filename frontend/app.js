document.addEventListener('DOMContentLoaded', () => {
  const imagesInput = document.getElementById('images');
  const previewContainer = document.getElementById('previewImages');
  const form = document.getElementById('itemForm');
  const result = document.getElementById('result');
  const BACKEND_API = 'http://81.177.136.42:8000';

  const submitBtn = form.querySelector('button[type="submit"]');

  let allFiles = [];

  function updatePreview() {
    previewContainer.innerHTML = '';
    allFiles.forEach(file => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      img.style.maxWidth = '150px';
      img.style.margin = '5px';
      previewContainer.appendChild(img);
    });
  }

  imagesInput.addEventListener('change', () => {
    const files = Array.from(imagesInput.files);
    allFiles = allFiles.concat(files);
    imagesInput.value = '';
    updatePreview();
  });

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('https://api.imgbb.com/1/upload?key=51dfd62899be9a81678bd567fce33470', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Ошибка загрузки картинки: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data.url;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.textContent = '';

    if (allFiles.length === 0) {
      result.textContent = 'Пожалуйста, выберите хотя бы одно изображение.';
      return;
    }

    try {
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Загрузка...';

      const urls = [];
      for (const file of allFiles) {
        const url = await uploadFile(file);
        urls.push(url);
      }

      const body = new URLSearchParams();
      body.append('title', form.title.value);
      body.append('price', form.price.value);
      body.append('description', form.description.value);
      body.append('gender', form.gender.value);
      body.append('images', JSON.stringify(urls));

      const response = await fetch(`${BACKEND_API}/items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      result.textContent = 'Товар успешно добавлен!';
      form.reset();
      allFiles = [];
      updatePreview();
    } catch (err) {
      result.textContent = 'Ошибка при отправке: ' + err.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Добавить товар';
    }
  });
});

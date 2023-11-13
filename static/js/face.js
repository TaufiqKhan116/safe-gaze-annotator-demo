const image_div = document.getElementById("imageContainer")
const img = document.getElementById("image")

const canvas = document.getElementById('img-canvas');
const ctx = canvas.getContext('2d');

const selected_faces_container = document.getElementById("selected-faces-container")
const face_count = document.getElementById('face-count')

const submit_faces = document.getElementById('submit-faces-btn')

let box_list = []

img.src = "multiple.webp"

function logJsonArray(objects) {
    const jsonArrayString = JSON.stringify(objects, null, 2);
    console.log(jsonArrayString);
}

function uuidv4() { 
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) { 
        const r = Math.random() * 16 | 0,  
            v = c == 'x' ? r : (r & 0x3 | 0x8); 
        return v.toString(16); 
    }); 
}

function cropImage(image, x, y, width, height) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const cropped_img = new Image()

    canvas.width = width;
    canvas.height = height;
    
    context.drawImage(image, x, y, width, height, 0, 0, width, height);
    cropped_img.src = canvas.toDataURL();

    return cropped_img
}

function drawRectangle(ctx, x, y, w, h) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
}

function appenedCroppedImage(container, image, image_width, image_height, id) {
    const cropped_canvas = document.createElement('canvas');
    const cropped_context = cropped_canvas.getContext('2d');
    const thumbnail_container = document.createElement('div')
    thumbnail_container.className = 'thumbnail-container'

    cropped_canvas.width = 100;
    cropped_canvas.height = 100;
    thumbnail_container.id = id
    
    image.onload = () => {
        cropped_context.drawImage(image, 0, 0, image_width, image_height, 0, 0, cropped_canvas.width, cropped_canvas.height);
        thumbnail_container.appendChild(cropped_canvas)
        container.appendChild(thumbnail_container)
    }

    return thumbnail_container
}

img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    let isDrawing = false;
    let startX, startY, width, height;

    canvas.addEventListener('mousedown', (event) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isDrawing = true;
        startX = event.offsetX;
        startY = event.offsetY;
    });

    canvas.addEventListener('mouseup', (event) => {
        isDrawing = false;
        width = event.offsetX - startX;
        height = event.offsetY - startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRectangle(ctx, startX, startY, width, height);
        const boundingBox = {
            id: uuidv4(),
            x: startX,
            y: startY,
            width: width,
            height: height,
        };
        if (boundingBox.width > 10 && boundingBox.height > 10)
            box_list.push(boundingBox)

        const appended_image_container = appenedCroppedImage(
            selected_faces_container,
            cropImage(
                img,
                boundingBox.x,
                boundingBox.y,
                boundingBox.width,
                boundingBox.height
            ),
            boundingBox.width,
            boundingBox.height,
            boundingBox.id
        )

        face_count.innerText = box_list.length

        appended_image_container.addEventListener('click', (event) => {
            box_list = box_list.filter((box) => {
                return box.id != appended_image_container.id
            })

            appended_image_container.remove()
            face_count.innerText = box_list.length

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            box_list.forEach((box) => {
                drawRectangle(ctx, box.x, box.y, box.width, box.height)
            })
        })

        appended_image_container.addEventListener('mouseover', (event) => {
            appended_image_container.style.borderColor = 'red'
            appended_image_container.style.borderStyle = 'outset'
        })

        appended_image_container.addEventListener('mouseout', (event) => {
            appended_image_container.style.borderColor = 'black'
            appended_image_container.style.borderStyle = 'solid'
        })

        box_list.forEach((box) => {
            drawRectangle(ctx, box.x, box.y, box.width, box.height)
        })
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isDrawing) {
            width = event.offsetX - startX;
            height = event.offsetY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRectangle(ctx, startX, startY, width, height);
        }
    });

    submit_faces.onclick = (event) => {
        alert(box_list)
        logJsonArray(box_list)
    }
}
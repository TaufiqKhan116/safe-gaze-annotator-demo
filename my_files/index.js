const image_div = document.getElementById("imageContainer")
const img = document.getElementById("image")

const canvas = document.getElementById('img-canvas');
const ctx = canvas.getContext('2d');

const next_btn = document.getElementById('next');

let box_list = []
let female_face_id_list = []

img.src = "trio.webp"

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

img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    let isDrawing = false;
    let startX, startY, width, height;

    function drawRectangle(x, y, w, h) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
    }
    function handleMouseDown(e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    }
    function handleMouseUp(e) {
        isDrawing = false;
        width = e.offsetX - startX;
        height = e.offsetY - startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRectangle(startX, startY, width, height);
        const boundingBox = {
            id: uuidv4(),
            x: startX,
            y: startY,
            width: width,
            height: height
        };
        box_list.push(boundingBox)
        // console.log(box_list)

        box_list.forEach((box) => {
            drawRectangle(box.x, box.y, box.width, box.height)
        })
    }
    function handleMouseMove(e) {
        if (isDrawing) {
            width = e.offsetX - startX;
            height = e.offsetY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRectangle(startX, startY, width, height);
        }
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    next_btn.onclick = (event) => {
        next_btn.disabled = true;
        img.style.display = "none";
        canvas.style.display = "none"

        for (let i = 0; box_list.length > 0 && i < box_list.length; i++) {

            // Create a canvas element
            
            const crop_canv = document.createElement('canvas');
            const crop_ctx = crop_canv.getContext('2d');
            crop_canv.className = 'canvas'; // Add CSS class for styling
            crop_canv.id = box_list[i].id

            crop_canv.onmousedown = () => {
                if (female_face_id_list.includes(crop_canv.id)) {
                    crop_ctx.clearRect(0, 0, 10, 10)

                    female_face_id_list = female_face_id_list.filter((item) => {
                        return item != crop_canv.id
                    })
                } else {
                    female_face_id_list.push(crop_canv.id)
                    crop_ctx.fillStyle = "blue"
                    crop_ctx.fillRect(0, 0, 10, 10)
                }
            }

            const x = box_list[i].x;
            const y = box_list[i].y;
            const width = box_list[i].width;
            const height = box_list[i].height;

            let cropped_image = cropImage(img, x, y, width, height)

            
            cropped_image.onload = () => {
                // crop_ctx.drawImage(cropped_image, 0, 0)

                box_list[i].cropped_image = cropped_image

                crop_ctx.drawImage(
                    cropped_image,
                    0, 0, cropped_image.width, cropped_image.height,
                    0, 0, crop_canv.width, crop_canv.height
                )
                crop_ctx.clearRect(0, 0, 10, 10)
            }

            console.log(box_list[i]);
            image_div.appendChild(crop_canv);
        }

        const submit_btn = document.createElement("button");
        submit_btn.innerText = "Submit"
        image_div.appendChild(submit_btn)
        submit_btn.onclick = (event) => {
            submit_btn.disabled = "true"

            female_face_id_list.forEach((id) => {
                box_list.forEach((box) => {
                    if (box.id == id) {
                        box.gender = "female"
                    } else {
                        box.gender = "male"
                    }
                })
            })

            alert(female_face_id_list);
            console.log(box_list)
        }
    }
}
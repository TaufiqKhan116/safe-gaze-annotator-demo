const img = new Image()
img.src = 'multiple.webp'

const json_str = `[
    {
      "id": "580423a5-6a5f-4e29-b264-b8f29e6b319f",
      "x": 119,
      "y": 162,
      "width": 26,
      "height": 31
    },
    {
      "id": "f64fdcb2-22d6-419c-a31a-aa0f5775d110",
      "x": 42,
      "y": 229,
      "width": 25,
      "height": 31
    },
    {
      "id": "20b13205-98d7-4a87-8fa9-4db69c78e033",
      "x": 172,
      "y": 170,
      "width": 13,
      "height": 27
    },
    {
      "id": "2de3325d-e5b0-43ed-9c7c-c67ca9f46156",
      "x": 93,
      "y": 225,
      "width": 25,
      "height": 29
    },
    {
      "id": "7f399c11-9d81-4726-bbf7-430667703ec8",
      "x": 224,
      "y": 166,
      "width": 10,
      "height": 31
    },
    {
      "id": "d5e4ceff-5527-4809-a47a-ddfef9f5f36c",
      "x": 148,
      "y": 225,
      "width": 24,
      "height": 28
    },
    {
      "id": "e5bc4083-2498-4072-b645-e5cf72482f62",
      "x": 259,
      "y": 168,
      "width": 19,
      "height": 31
    },
    {
      "id": "765b520d-950f-49b9-a53e-2fb90460bcbc",
      "x": 196,
      "y": 226,
      "width": 17,
      "height": 33
    },
    {
      "id": "5e4ebad0-4c56-4b94-8370-b013739e7b01",
      "x": 300,
      "y": 159,
      "width": 16,
      "height": 25
    },
    {
      "id": "e6219605-3488-423d-b75f-4793ce79f9f5",
      "x": 239,
      "y": 226,
      "width": 27,
      "height": 36
    },
    {
      "id": "df58b3a0-6f0d-4172-9c90-594c7dbf726e",
      "x": 349,
      "y": 163,
      "width": 24,
      "height": 30
    },
    {
      "id": "ed453e7a-cb4a-445e-9ab0-56c7f590ad0a",
      "x": 285,
      "y": 238,
      "width": 30,
      "height": 32
    }
  ]`

const submit_btn = document.getElementById('submit-gender-btn')

let box_list = []

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

function parseJSON(json_str) {
    try {
        const jsonArray = JSON.parse(json_str);
        console.log(jsonArray);

        return jsonArray
    } catch (error) {
        console.error('Error parsing JSON:', error);

        return null
    }
}

function load_faces(img, box_list) {
    for(let i = 0; i < box_list.length && i < 9; i++) {
        const img_container = document.getElementById('face-' + (i+1))
        const sub_container = document.createElement('div')
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        canvas.width = 100
        canvas.height = 100
        sub_container.id = box_list[i].id
        sub_container.style.borderStyle = 'groove'
        sub_container.style.borderColor = 'black'
        sub_container.style.margin = '2px'
        sub_container.style.width = 'fit-content'
        sub_container.style.borderWidth = '5px'

        sub_container.onclick = (event) => {
            sub_container.style.borderStyle = 'solid'
            sub_container.style.borderColor = 'red'

            box_list.forEach(box => {
                if (box.id == sub_container.id) {
                    if(box.gender == 'undefined') {
                        box.gender = 1
                    } else {
                        if (box.gender == 1) {
                            box.gender = 0 // Male
                            sub_container.style.borderStyle = 'groove'
                            sub_container.style.borderColor = 'black'
                        } else {
                            box.gender = 1 // Female
                            sub_container.style.borderStyle = 'solid'
                            sub_container.style.borderColor = 'red'
                        }
                    }
                }
            });
        }

        const cropped_image = cropImage(img, box_list[i].x, box_list[i].y, box_list[i].width, box_list[i].height)

        cropped_image.onload = () => {
            context.drawImage(
                cropped_image,
                0, 0, cropped_image.width, cropped_image.height,
                0, 0, canvas.width, canvas.height
            )
            sub_container.appendChild(canvas)
            img_container.appendChild(sub_container)
        }
    }
}

img.onload = () => {
    box_list = parseJSON(json_str)
    load_faces(img, box_list)

    submit_btn.onclick = () => {
        let selected_ids = ''
        box_list.forEach((box) => {
            if (box.gender == 1) {
                selected_ids += box.id + ', '
                console.log(box)
            }
        })
        alert(selected_ids)
    }
}
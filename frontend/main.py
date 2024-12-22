import requests

# URL de la imagen que deseas descargar
url = 'https://i.waifu.pics/Lcq0Tx8.jpg'

# Realiza la solicitud GET
response = requests.get(url)

# Guarda la imagen en un archivo
with open('imagen.jpg', 'wb') as file:
    file.write(response.content)

print('Imagen descargada con éxito')

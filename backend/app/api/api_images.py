import requests
import random
IMAGES_TAGS = { 
    "waifu.im": {
        "sfw": [
            "maid",
            "waifu",
            "marin-kitagawa",
            "mori-calliope",
            "raiden-shogun",
            "oppai",
            "selfies",
            "uniform",
            "kamisato-ayaka"
        ],
        "nsfw": [
            "ass",
            "hentai",
            "milf",
            "oral",
            "paizuri",
            "ecchi",
            "ero"
        ]
    },
    "waifu.pics": {   
        "sfw": [
            "waifu",
            "neko",
            "shinobu",
            "megumin",
            "bully",
            "cuddle",
            "cry",
            "hug",
            "awoo",
            "kiss",
            "lick",
            "pat",
            "smug",
            "bonk",
            "yeet",
            "blush",
            "smile",
            "wave",
            "highfive",
            "handhold",
            "nom",
            "bite",
            "glomp",
            "slap",
            "kill",
            "kick",
            "happy",
            "wink",
            "poke",
            "dance",
            "cringe"
        ], 
        "nsfw": [
            "waifu",
            "neko",
            "trap",
            "blowjob"
        ]
    }
}
def get_tags():
    sfw_tags = set(IMAGES_TAGS["waifu.im"]["sfw"] + IMAGES_TAGS["waifu.pics"]["sfw"])
    nsfw_tags = set(IMAGES_TAGS["waifu.im"]["nsfw"] + IMAGES_TAGS["waifu.pics"]["nsfw"])

    ordered_sfw_tags = list(sfw_tags)
    ordered_sfw_tags.sort()
    ordered_nsfw_tags = list(nsfw_tags)
    ordered_nsfw_tags.sort()

    return {
        "sfw": ordered_sfw_tags,
        "nsfw": ordered_nsfw_tags
    }


WAIFU_IM_API_URL = "https://api.waifu.im/search"
WAIFU_PICS_API_URL = "https://api.waifu.pics"
def fetch_image(tag="waifu", type="sfw"):
    source_api = random.randint(0, 1)
    try:
        if source_api == 0 and IMAGES_TAGS["waifu.im"][type].count(tag) == 0:
            source_api = 1
        elif source_api == 1 and IMAGES_TAGS["waifu.pics"][type].count(tag) == 0:
            source_api = 0

        if source_api == 0:
            params = {
                "included_tags": [tag],
                "is_nsfw": type == "nsfw"
            }
            response = requests.get(WAIFU_IM_API_URL, params=params)

            if response.status_code == 200:
                data = response.json()
                return {
                    "image_url": data["images"][0]["url"],
                    "source_api": WAIFU_IM_API_URL
                }
            return {
                "error": "Failed to fetch image"
            }

        elif source_api == 1:
            response = requests.get(f"{WAIFU_PICS_API_URL}/{type}/{tag}")

            if response.status_code == 200:
                data = response.json()
                return {
                    "image_url": data["url"],
                    "source_api": WAIFU_PICS_API_URL
                }
            return {
                "error": "Failed to fetch image"
            }
    except:
        return {
            "error": "Invalid tag or type"
        }

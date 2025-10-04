CATEGORY_MAP = {
    "milk": "Dairy",
    "cheese": "Dairy",
    "apple": "Fruits",
    "banana": "Fruits",
    "rice": "Grains",
    "bread": "Bakery",
    "chicken": "Meat",
    "tomato": "Vegetables",
    "onion": "Vegetables",
    "oil": "Grocery",
}


def auto_categorize(item_name: str) -> str:
    name = item_name.lower()
    for keyword, category in CATEGORY_MAP.items():
        if keyword in name:
            return category
    return "Others"

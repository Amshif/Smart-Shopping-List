-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== SHOPPING LISTS TABLE ==========
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT DEFAULT 'My Grocery List',
    share_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========== GROCERY ITEMS TABLE ==========
CREATE TABLE grocery_items (
    id SERIAL PRIMARY KEY,
    list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    category TEXT DEFAULT 'Others',
    bought BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ========== OPTIONAL CATEGORIES TABLE ==========
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Example prefilled categories
INSERT INTO categories (name) VALUES
('Fruits'),
('Vegetables'),
('Dairy'),
('Meat'),
('Bakery'),
('Grains'),
('Snacks'),
('Others');

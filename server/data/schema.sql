CREATE TABLE animal_categories (
    id SERIAL PRIMARY KEY,
    category character varying(255)
);

CREATE TABLE animal_photos (
    id SERIAL PRIMARY KEY,
    category_id SERIAL REFERENCES animal_categories(id),
    photo_url text
);


-- In addition, you will be add APIs that allow users to add or delete animal categories, updating the categories available in the UI. 
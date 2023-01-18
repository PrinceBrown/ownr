import React, { useState, useEffect } from "react";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/client'

const GET_ANIMAL_CATEGORIES = gql`
    query Animals_Categories  {
        animal_categories {
            id
            category
        }
    }
`;

const GET_ANIMAL_PHOTOS_BY_CATEGORY = gql`
    query  Animal_Photos_By_Category($categoryId: Int!) {
        animal_photos_by_category(category_id: $categoryId) {
            id
            category_id
            photo_url
        }
    }
`;

export function useAnimalsPhotosByCategory(categoryId) {
    const { data, loading, error } = useQuery(GET_ANIMAL_PHOTOS_BY_CATEGORY, {
        variables: { categoryId },
    });

    return { data, loading, error };
}

function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState(1);
    const [toggledCategories, setToggledCategories] = useState([1]);
    const [allImages, setAllImages] = useState([]);

    const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(GET_ANIMAL_CATEGORIES);
    const { data: photoData, loading: photoLoading, error: photoError } = useAnimalsPhotosByCategory(selectedCategoryId);

    useEffect(() => {
        setToggledCategories([1]);
    }, []);

    useEffect(() => {
        setAllImages([...allImages, ...images]);
    }, [allImages]);
    if (categoryLoading || photoLoading) return <p>Loading...</p>;
    if (categoryError || photoError) return <p>Error</p>;

    const images = photoData.animal_photos_by_category && photoData.animal_photos_by_category.map(photo => ({ ...photo, photo_url: photo.photo_url }));


    function handleNext() {
        setCurrentIndex(currentIndex === allImages.length - 1 ? 0 : currentIndex + 1);
    }

    function handlePrevious() {
        setCurrentIndex(currentIndex === 0 ? allImages.length - 1 : currentIndex - 1);
    }

    function handleCategoryChange(_categoryId) {
        setSelectedCategoryId(_categoryId);
        setCurrentIndex(0);
        handleToggleCategory(_categoryId)
    }

    function handleToggleCategory(_categoryId) {
        if (toggledCategories.includes(_categoryId)) {
            setToggledCategories(toggledCategories.filter(category => category !== _categoryId));
        } else {
            setToggledCategories([...toggledCategories, _categoryId]);
        }
    }

    const filteredImages = allImages.filter(image => toggledCategories.includes(image.category_id));

    // Shuffle the images randomly
    const shuffledImages = filteredImages.sort(() => 0.5 - Math.random());
    setAllImages(shuffledImages);

    // function handleToggleCategory(_categoryId) {
    //     if (toggledCategories.includes(_categoryId)) {
    //         setToggledCategories(toggledCategories.filter(category => category !== _categoryId));
    //     } else {
    //         setToggledCategories([...toggledCategories, _categoryId]);
    //     }
    //     setAllImages([]);
    //     toggledCategories.forEach(categoryId => {
    //         const { data: photoData, loading, error } = useAnimalsPhotosByCategory(categoryId);
    //         if (!loading && !error) {
    //             setAllImages([...allImages, ...photoData.animal_photos_by_category.map(photo => ({ ...photo, photo_url: photo.photo_url }))]);
    //         }
    //     });
    // }

    return (
        <>
            {!categoryLoading && !photoLoading && !categoryError && !photoError && (
                <div>
                    <div className="mb-3">
                        <h1 className="text-4xl text-center">Image Carousel</h1>
                        <div>
                            <p className="text-center">Click on the arrows to navigate through the images</p>
                        </div>
                    </div>
                    <div className="py-5 flex items-center justify-center overflow-x-auto white-space-nowrap" style={{ overflowX: 'auto' }}>
                        {categoryData.animal_categories && categoryData.animal_categories.map((category, index) => (
                            <button onClick={() => handleCategoryChange(category.id)} className={`btn mx-3 ${toggledCategories.includes(category.id) ? 'active' : ''}`} key={index}>{category.category} {category.id}</button>
                        ))}
                    </div>
                    <div className=" flex py-5 rounded-lg">
                        <RxTrackPrevious onClick={handlePrevious} className="text-5xl cursor-pointer" />
                        <img src={filteredImages[currentIndex]} alt="Animal" className="w-full h-full object-cover" />
                        <RxTrackNext onClick={handleNext} className="text-5xl cursor-pointer" />
                    </div>
                </div>
            )}
        </>
    );
}





export default ImageCarousel;


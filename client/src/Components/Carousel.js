/* eslint-disable no-mixed-operators */
import React, { useState } from "react";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import useSwr from "swr";







// const GET_ANIMAL_CATEGORIES = gql`
//     query Animals_Categories  {
//         animal_categories {
//             id
//             category
//         }
//     }

// `;



// const GET_ANIMAL_PHOTOS_BY_CATEGORY = gql`
//     query  Animal_Photos_By_Category($categoryId: Int!) {
//         animal_photos_by_category(category_id: $categoryId) {
//             id
//             category_id
//             photo_url
//         }
//     }
// `;







// export function useAnimalPhotosByCategory(categoryId) {
//     const { data, loading, error } = useQuery(GET_ANIMAL_PHOTOS_BY_CATEGORY, {
//         variables: { categoryId },
//     });

//     return { data, loading, error };
// }















const fetcher = (url) => fetch(url).then((r) => r.json());

const URI = "http://localhost:8500/api";
const getAnimalsCategories = "/all-categories"
const getAnimalPhotosByCategory = "/animals-categories/"
 




function ImageCarousel() {



    const [currentIndex, setCurrentIndex] = useState(0);

    const [categoryId, setCategoryId] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([1]);




    console.log("categoryId", categoryId)







    const { data: categoryData, loading: categoryLoading, error: categoryError } = useSwr(URI+getAnimalsCategories, fetcher);
    const { data: photoData, loading: photoLoading, error: photoError } = useSwr(URI +getAnimalPhotosByCategory+categoryId, fetcher);








    if (categoryLoading || photoLoading) return <p>Loading...</p>;
    if (categoryError || photoError) return <p>Error</p>;

    console.log("categoryData", categoryData && categoryData.animal_categories)
 
    const images = photoData && photoData.animalsByCategory.map((photo) => photo.photo_url) || [];

    // const images = photoData && photoData.animalsByCategory.filter(photo => selectedCategories.includes(photo.category_id)).map((photo) => photo.photo_url) || [];









    function handleNext() {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }

    function handlePrevious() {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }



    //save the image in a state variable and then filter the images based on the category id





    function handleCategoryChange(_categoryId) {
        setCategoryId(parseInt(_categoryId));
        setCurrentIndex(0);
        handleToggleCategory(_categoryId)
    }


    function handleToggleCategory(_categoryId) {
    }


    function handleCategoryChange(_categoryId) {
        setCategoryId(parseInt(_categoryId));
        setCurrentIndex(0);
        handleToggleCategory(_categoryId)
    }

    function handleToggleCategory(_categoryId) {
        if (selectedCategories.includes(_categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== _categoryId));
        } else {
            setSelectedCategories([...selectedCategories, _categoryId]);
        }
    }





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
                       {/* {categoryData && categoryData.animal_categories.map((category, index) => (
                            <button
                                onClick={() => handleCategoryChange(category.id)}
                                className={`btn mx-3 ${parseInt(category.id) === categoryId ? 'btn-primary' : ''}`}
                                key={index}
                            >
                                {category.category} {category.id}
                            </button>
                        ))}  */}

                        <div className="py-5 flex items-center justify-center overflow-x-auto white-space-nowrap" style={{ overflowX: 'auto' }}>
                            {categoryData && categoryData.animal_categories.map((category, index) => (
                                <button onClick={() => handleCategoryChange(category.id)} className={`btn mx-3 ${selectedCategories.includes(category.id) ? 'btn-primary' : ''}`} key={index}>{category.category}</button>
                            ))}
                        </div>

                    </div>      





                    <div className=" flex py-5 rounded-lg">



                        <button
                            className={` text-3xl  px-2  ${currentIndex !== 0 ? 'visible' : 'invisible'} `} onClick={handlePrevious}>
                            <RxTrackPrevious />
                        </button>


                        <div className=" mx-4" >

                            {/* One way we can prevent layout shift by setting fixed width and height */}
                            <img
                                className="rounded shadow-lg shadow-base-400 w-full h-full object-contain"
                                src={images[currentIndex]}
                                alt="carousel of animals"
                            />


                        </div>






                        <button className={`text-3xl  px-2  ${currentIndex !== images.length - 1 ? 'visible' : 'invisible'} `} onClick={handleNext}>
                            <RxTrackNext />
                        </button>


                    </div>

                </div>

            )}


        </>
    );
}

export default ImageCarousel;

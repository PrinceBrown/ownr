/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ImageCarousel from '../src/Components/Carousel';

const mockData = {
    animal_categories: [
        { id: 1, category: 'dogs' },
        { id: 2, category: 'cats' },
        { id: 3, category: 'birds' },
    ],
    animalsByCategory: [
        { category_id: 1, photo_url: 'dog1.jpg' },
        { category_id: 1, photo_url: 'dog2.jpg' },
        { category_id: 1, photo_url: 'dog3.jpg' },
        { category_id: 2, photo_url: 'cat1.jpg' },
        { category_id: 2, photo_url: 'cat2.jpg' },
        { category_id: 3, photo_url: 'bird1.jpg' },
    ],
};

jest.mock('swr', () => ({
    useSWR: jest.fn((url) => {
        if (url.endsWith('all-categories')) {
            return {
                data: mockData.animal_categories,
                loading: false,
                error: false,
            };
        } else if (url.endsWith('animals-categories/1')) {
            return {
                data: mockData.animalsByCategory,
                loading: false,
                error: false,
            };
        }
    }),
}));

describe('ImageCarousel', () => {
    test('should render without errors', async () => {
        const { getByText, getByTestId } = render(<ImageCarousel />);

        expect(getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(getByTestId('carousel')).toBeInTheDocument();
        });
    });

    test('should change category when a button is clicked', async () => {
        const { getByText, getByTestId } = render(<ImageCarousel />);

        await waitFor(() => {
            expect(getByTestId('carousel')).toBeInTheDocument();
        });

        fireEvent.click(getByText('cats'));

        expect(getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(getByTestId('carousel')).toBeInTheDocument();
        });
    });

    test('should navigate between images when the next and previous buttons are clicked', async () => {
        const { getByText, getByTestId } = render(<ImageCarousel />);

        await waitFor(() => {
            expect(getByTestId('carousel')).toBeInTheDocument();
        });

        fireEvent.click(getByTestId('next-button'));
        fireEvent.click(getByTestId('previous-button'));

        // Assert that the current image has changed
    });
});

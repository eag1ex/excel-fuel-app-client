import { PetrolModel } from '@pl/interfaces';

export const dymmyItem: PetrolModel = {
    id: '1234',
    name: 'Migrol Tankstelle',
    address: 'Scheffelstrasse 16',
    city: 'Zürich',
    latitude: 47.3943939,
    longitude: 8.52981,
    created_at: 'Sat Sep 04 2021',
    updated_at: 'Sat Sep 04 2021',
    prices: [
      {
        price: 1.81,
        currency: 'CHF',
        product_id: 'DIESEL'
      }
    ],
    products: [
      {
        product_id: 'DIESEL',
        points: [
          {
            id: '1',
            status: 'available'
          },
          {
            id: '2',
            status: 'not_available'
          }
        ]
      }
    ]
  }

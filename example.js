function API() {
    return {
        //  админке заголовки подписывать как в макете
        '$BaseURL/start': [
            {
                text: String,
                bathroom: [
                    {

                    }
                ]
            },
            {
                text: String,
                price: Number
            },
            // ...
        ],
        '$BaseURL/extra/addons': [
            {
                icon: String,
                text: String,
                price: Number // сделать пометку что это доллары в админке
            },
            {
                icon: String,
                text: String,
                price: Number
            },
            // ...
        ],
        '$BaseURL/extra/addons': [
            {
                icon: String,
                text: String,
                price: Number // сделать пометку что это доллары в админке
            },
            {
                icon: String,
                text: String,
                price: Number
            },
            // ...
        ],
        '$BaseURL/extra/pets': [
            'No pets',
            'Cat',
            'Dog',
            String,
            // ...
        ],
        '$BaseURL/booking/date': [
            {
                day: String,
                sale: Number // сделать пометку что это проценты в админке, 0% - default
            },
            {
                day: 'Mon',
                sale: 14
            },
            // ...
            // всегда в одном порядке, т.е. Понедельник -> Вторник -> Среда ...
        ],
        '$BaseURL/booking/time': [
            {
                text: String,
                sale: Number // сделать пометку что это доллары в админке, 0% - default
            },
            {
                text: '8:30 am',
                sale: 14
            },
            // ...
        ],
        '$BaseURL/entrance': [
            'Someone at Home',
            'Hidden Key',
            // ...
        ],
        '$BaseURL/frequent': [
            {
                text: String,
                sale: Number // сделать пометку что это проценты в админке
            },
            {
                text: 'One time',
                sale: 0 // сделать пометку что это проценты в админке, 0% - default
            }
        ]
    }
}

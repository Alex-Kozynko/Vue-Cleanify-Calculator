function API() {
    return {
        '$baseURL/stepOne': {
            industry: [
                {
                    text: 'Corporate Offices',
                    abridgment: 'Corp. Offices',
                },
                {
                    text: 'Residential Facilities',
                    abridgment: 'Residential Facilities',
                    bedroom: true
                },
                {
                    text: 'Religious Facility',
                    abridgment: 'Religious Facility',
                },
                {
                    text: 'Fitness Locations',
                    abridgment: 'Fitness Locations',
                },
                {
                    text: 'Educational Facilities',
                    abridgment: 'Educational Facilities',
                },
                {
                    text: 'Medical Facilities',
                    abridgment: 'Medical Facilities',
                },
                {
                    text: 'Retail Storefronts',
                    abridgment: 'Retail Storefronts',
                },
                {
                    text: 'Hospitality',
                    abridgment: 'Hospitality',
                }
            ],
            bedroom: [
                {
                    text: 'Studio',
                    abridgment: 'Studio'
                },
                {
                    text: '1 Bedroom',
                    abridgment: '1 Bed'
                },
                {
                    text: '2 Bedrooms',
                    abridgment: '2 Bed'
                },
                {
                    text: '3 Bedrooms',
                    abridgment: '3 Bed'
                },
                {
                    text: '4 Bedrooms',
                    abridgment: '4 Bed'
                },
                {
                    text: '5 Bedrooms',
                    abridgment: '5 Bed'
                },
                {
                    text: '6 and Up Bedrooms',
                    abridgment: '6+ Bed'
                },
            ],
            bathroom: [
                {
                    text: '1 Bathroom',
                    abridgment: '1 Bath'
                },
                {
                    text: '2 Bathroom',
                    abridgment: '2 Bath'
                },
                {
                    text: '3 Bathroom',
                    abridgment: '3 Bath'
                },
                {
                    text: '4 Bathroom',
                    abridgment: '4 Bath'
                },
                {
                    text: '5 Bathroom',
                    abridgment: '5 Bath'
                },
                {
                    text: '6 and Up Bathroom',
                    abridgment: '6+ Bath'
                },
            ],
            typeCleaning: [
                {
                    text: 'Standard',
                    abridgment: 'Standard',
                    duration: 2,
                    dependencies: {
                        bathroom: 20,
                        bedroom: 7
                    }
                },
                {
                    text: 'Deep Clean',
                    abridgment: 'Deep Clean',
                    duration: 4,
                    dependencies: {
                        bathroom: 60,
                        bedroom: 20
                    }
                },
            ],
            dependencies: {
                standard: {
                    bathroom: 20,
                    bedroom: 7
                },
                deep: {
                    bathroom: 60,
                    bedroom: 20
                }
            }
        }
    }
}

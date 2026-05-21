from fastapi import APIRouter, HTTPException

import requests

router = APIRouter(
    prefix="/pharmacy",
    tags=["Pharmacy"]
)

API_KEY = "0f6dd8b1829349779cf328451c51e6f9"


@router.get("/nearby")
def get_nearby_pharmacies(
    lat: float,
    lon: float
):

    try:

        # FIRST TRY USER LOCATION
        # THEN FALLBACK TO KOLKATA

        search_locations = [

            {
                "lat": lat,
                "lon": lon,
                "label": "Your Area"
            },

            {
                "lat": 22.5726,
                "lon": 88.3639,
                "label": "Kolkata"
            }

        ]

        for location in search_locations:

            url = (
                f"https://api.geoapify.com/v2/places?"
                f"categories=healthcare.pharmacy"
                f"&filter=circle:{location['lon']},{location['lat']},20000"
                f"&bias=proximity:{location['lon']},{location['lat']}"
                f"&limit=20"
                f"&apiKey={API_KEY}"
            )

            print("REQUEST URL:")
            print(url)

            response = requests.get(url)

            data = response.json()

            print("FULL RESPONSE:")
            print(data)

            features = data.get(
                "features",
                []
            )

            pharmacies = []

            # IF FOUND
            if len(features) > 0:

                for place in features:

                    props = place.get(
                        "properties",
                        {}
                    )

                    pharmacies.append({

                        "name":
                        props.get(
                            "name",
                            ""
                        ),

                        "address":
                        props.get(
                            "formatted",
                            "No address available"
                        ),

                        "map_url":
                        f"https://www.google.com/maps/search/?api=1&query={props.get('lat')},{props.get('lon')}",

                        "source":
                        location["label"]

                    })

                print(
                    f"FOUND USING: {location['label']}"
                )

                return pharmacies

        return []

    except Exception as e:

        print(
            "Pharmacy Route Error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
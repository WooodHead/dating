<?php

namespace App\Services;


class UserProfileService
{
    private \stdClass $options;

    public function __construct()
    {
        $this->options =  json_decode(
        '{
            "gender": {
            "male": "Male",
            "female": "Female"
        },
        "status": {
            "single": "Single",
            "married": "Married",
            "divorced": "Divorced"
        },
        "hair": {
            "white": "White",
            "blonde": "Blonde",
            "chestnut": "Chestnut",
            "copper": "Copper",
            "bald": "Bald",
            "dark": "Dark",
            "saltAndPepper": "Salt and pepper",
            "ginger": "Ginger"
            },
        "hairType": {
            "natural": "Natural",
            "semiShaved": "Semi shaved",
            "shaved": "Shaved",
            "no": "No"
        },
        "eyes": {
            "brown": "Brown",
            "blue": "Blue",
            "grey": "Grey",
            "black": "Black",
            "green": "Green"
        },
        "preference": {
            "male": "Male",
            "female": "Female",
            "all": "All"
        },
        "bodyType": {
            "slim": "Slim",
            "muscular": "Muscular",
            "normal": "Normal",
            "fewExtraPounds": "Few extra pounds",
            "athletic": "Athletic"
        },
        "professional": {
            "Farmer": "Farmer",
            "Manager": "Manager",
            "Employee": "Employee",
            "Student": "Student",
            "Worker": "Worker",
            "Liberal occupation": "Liberal occupation",
            "Retried": "Retried",
            "Unemployed": "Unemployed",
            "Not specified": "Not specified"
        },
        "diet": {
            "all": "All",
            "bio": "Bio",
            "picky": "Picky",
            "vegetarian": "Vegetarian"
        },
        "smoke": {
            "yes": "Yes",
            "no": "No",
            "occasionally": "Occasionally"
        },
        "ethnic": {
            "European": "European",
            "African": "African",
            "Caribbean": "Caribbean",
            "Arab": "Arab",
            "Asian": "Asian",
            "Latin": "Latin",
            "Other": "Other",
            "No": "No"
        },
        "alcohol": {
            "occasionally": "Occasionally",
            "never": "Never",
            "at_night": "At night",
            "regularly": "Regularly"
        }
            }');
    }







    public function genderOptions():array
    {
        return [
            'Male' => 'Male',
            'Female' => 'Female',
        ];
    }

    public function statusOptions():array
    {
        return [
            'Single' => 'Single',
            'Married' => 'Married',
            'Divorced' => 'Divorced',

        ];
    }

    public function preferencesOptions():array
    {
        return [
            'Men' => 'Men',
            'Women' => 'Women',
            'All' => 'All',
        ];
    }

    public function bodyTypeOptions(): array
    {
        return [
            'Slim' => 'Slim',
            'Muscular' => 'Muscular',
            'Normal' => 'Normal',
            'Few extra pounds' => 'Few extra pounds',
            'Athletic' => 'Athletic',
        ];
    }

    public function hairTypeOptions(): array
    {
        return [
            'Natural' => 'Natural',
            'Semi shaved' => 'Semi shaved',
            'Shaved' => 'Shaved',
            'No' => 'No',
        ];
    }

    public function hairColorOptions(): array
    {
        return [
            'White' => 'White',
            'Blonde' => 'Blonde',
            'Chestnut' => 'Chestnut',
            'Copper' => 'Copper',
            'Bald' => 'Bald',
            'Dark' => 'Dark',
            'Salt and pepper' => 'Salt and pepper',
            'Ginger' => 'Ginger',
        ];
    }

    public function eyesOptions(): array
    {
        return [
            'Brown' => 'Brown',
            'Blue' => 'Blue',
            'Grey' => 'Grey',
            'Black' => 'Black',
            'Green' => 'Green',
        ];
    }

    public function dietOptions(): array
    {
        return [
            'All' => 'All',
            'Bio' => 'Bio',
            'Picky' => 'Picky',
            'Vegetarian' => 'Vegetarian',
        ];
    }

    public function smokerOptions(): array
    {
        return [
            'Yes' => 'Yes',
            'No' => 'No',
            'Occasionally' => 'Occasionally',
        ];
    }

    public function alcoholOptions(): array
    {
        return [
            'Occasionally' => 'Occasionally',
            'Never' => 'Never',
            'At night' => 'At night',
            'Regularly' => 'Regularly',
        ];
    }

    public function professionOptions():array
    {
        return (array)$this->options->professional;
    }

    public function ethnicOptions():array
    {
        return (array)$this->options->ethnic;
    }

}

<?php

namespace Card\ForbiddenWordsCard;

use App\Models\Forbiddenword;
use Laravel\Nova\Card;

class ForbiddenWordsCard extends Card
{
    /**
     * The width of the card (1/3, 1/2, or full).
     *
     * @var string
     */
    public $width = 'full';


    /**
     * Get the component name for the element.
     *
     * @return string
     */
    public function component()
    {
        return 'ForbiddenWordsCard';
    }

    public function words()
    {
        return $this->withMeta(['words' => Forbiddenword::all()->toArray()]);
    }


}

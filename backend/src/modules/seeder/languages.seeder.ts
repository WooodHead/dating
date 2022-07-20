import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Seeder} from "nestjs-seeder";
import {Languages} from "../addition-data/schemas/languages.schema";


@Injectable()
export class LanguagesSeeder implements Seeder {

    public arr = [
        "Abkhaz",'Afrikaans', "Albanian", "Arabic", "Armenian", "Azerbaijani", "Bashkir", "Belarusian",
        "Bulgarian", "Catalan; Valencian", "Chinese", "Croatian", "Czech", "Danish", "Dutch", "English", "Estonian", "Fijian", "Finnish", "French", "German", "Greek, Modern", "Hindi",
        "Hungarian", "Irish", "Icelandic", "Italian", "Japanese", "Kazakh", "Korean", "Latin", "Luxembourgish, Letzeburgesch", "Lithuanian", "Latvian", "Macedonian", "Malagasy", "Mongolian",
        "Norwegian", "Polish", "Portuguese", "Romansh", "Romanian, Moldavian, Moldovan", "Russian", "Sindhi", "Serbian", "Slovak", "Slovene", "Spanish", "Castilian", "Swedish", "Thai",
        "Turkish", "Tatar", "Ukrainian", "Uzbek", "Vietnamese"
    ]

    constructor(
        @InjectModel(Languages.name) private readonly languagesModel: Model<Languages>
    ) {
    }

    async seed(): Promise<any> {
        const finalArr = [];
        this.arr.map(item => {
            const _item = new this.languagesModel({name: item})
            finalArr.push(_item);
        })
        return this.languagesModel.insertMany(finalArr);
    }

    async drop(): Promise<any> {
        return this.languagesModel.deleteMany({});
    }
}

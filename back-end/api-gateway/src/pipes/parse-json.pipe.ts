import { Injectable, PipeTransform } from "@nestjs/common";

interface ParseJsonPipeOptions {
    notParseProps: string[];
}

@Injectable()
export class ParseJsonPipe implements PipeTransform<any, any> {

    private parseJsonPipeOptions: ParseJsonPipeOptions;

    constructor(options: ParseJsonPipeOptions = { notParseProps: [] }) {
        this.parseJsonPipeOptions = options;
    }

    transform(value: any): any {
        for(const k in value) {
            if (this.parseJsonPipeOptions.notParseProps.includes(k)) {
                continue;
            }
            try {
                value[k] = JSON.parse(value[k]);
            } catch (err) {
                value[k] = value[k];
            }
        }
        return value;
    }
}
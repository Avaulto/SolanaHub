import { Observable } from 'rxjs';
export declare const handleEvent: <SourceType, OutputType>(project: (value: SourceType) => Observable<OutputType | null>) => (source: Observable<SourceType | null>) => Observable<OutputType | null>;

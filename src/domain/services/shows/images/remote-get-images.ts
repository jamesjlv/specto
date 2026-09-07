import { IShowImage } from "@/domain/models";

interface IGetShowImagesService {
  exec: (params: GetShowImagesServiceNamespace.Params) => Promise<GetShowImagesServiceNamespace.Model>;
}

export namespace GetShowImagesServiceNamespace {
  export type Params = {};

  export type Model = IShowImage[];

  export type Interface = IGetShowImagesService;
}

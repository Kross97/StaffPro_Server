import {IncomingMessage} from "http";

type names = 'name' | 'controller' | 'method';

const dispatcherName: Record<number, names> = {
  0: 'name',
  1: 'controller',
  2: 'method',
};

type Names = {
  [K in names]: string;
}

export const getNamesForReq = (req: IncomingMessage): Names => {
  const namesReq =  req.url.slice(1).split('/').reduce((acc, item, index) => index < 3 ?
      {...acc, [dispatcherName[index]]: item}
      :
      acc  , {} as Names);
  return namesReq;
};

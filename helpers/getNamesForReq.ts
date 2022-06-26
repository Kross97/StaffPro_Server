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
  console.log('req.url.slice(1)', req.url.slice(1));
  const namesReq =  req.url.slice(1).split('/').reduce((acc, item, index) => index < 2 ?
      {...acc, [dispatcherName[index]]: item}
      :
      {...acc, [dispatcherName[2]]: (acc[dispatcherName[2]] ?? '') + `${index === 2 ? '' : '/'}${item}`}  , {} as Names);
  return namesReq;
};

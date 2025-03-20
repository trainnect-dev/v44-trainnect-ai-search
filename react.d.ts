// React type declarations
import * as React from 'react';

declare global {
  namespace React {
    interface FC<P = {}> {
      (props: P & { children?: React.ReactNode }): React.ReactElement | null;
    }
    
    type ReactNode = 
      | React.ReactElement
      | string
      | number
      | boolean
      | null
      | undefined
      | React.ReactNodeArray;
      
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }
    
    type Key = string | number;
    
    type ReactNodeArray = Array<ReactNode>;
    
    interface JSXElementConstructor<P> {
      (props: P): ReactElement<P, any> | null;
    }
  }
}

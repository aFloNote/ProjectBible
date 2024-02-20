

import { SelectItem } from "@/views/admin/sermonadmin/selectItem";
import { NewItem } from "@/views/admin/sermonadmin/newItem";

interface Props {
  items: any[] | undefined;
  error: Error | null;
  type: string;
  idKey: string;
  nameKey: string;
  desc: string;
  

}

export function AuthorSeries({items, error, type, idKey,nameKey,desc}: Props) {
  


   
    

  return (
    <div>
    <h1 className="flex justify-center text-xl font-semibold">
    
      {type}
    </h1>
     
    
    <div>
      {items && (
        <>
          <SelectItem items={items} error={error as Error} type={type} idKey={idKey} nameKey={nameKey} />
          <NewItem  items={items} error={error as Error} type={type} head={nameKey} desc={desc}/>
        </>
      )}
    </div>
    
  </div>
  );
}


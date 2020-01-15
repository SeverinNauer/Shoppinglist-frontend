import IListItem from "./IListItem";
export default interface IShoppingList{
    id: number;
    listname: string;
    items:Array<IListItem>;
}

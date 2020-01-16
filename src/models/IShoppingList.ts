import IListItem from "./IListItem";
export default interface IShoppingList{
    id: number;
    listname: string;
    isFavourite: boolean;
    items:Array<IListItem>;
}

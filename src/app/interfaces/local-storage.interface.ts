export interface DiscoverItemData {
    items: ItemGroup[]
}

export interface ItemGroup {
    groupName: string;
    storageItems: StorageItem[];
}

export interface StorageItem {
    name: string;
    description: string;
    discovered: boolean;
    htmlClass: string;
    tag: string;
}
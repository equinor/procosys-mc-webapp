//https://www.angularfix.com/2022/03/how-to-get-random-enum-in-typescript.html
export default function RandomEnum<T>(anEnum: T): T[keyof T] | null {
    // const enumValues = Object.keys(anEnum)
    //     .map((n) => n)
    //     .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];
    // const randomIndex = Math.floor(Math.random() * enumValues.length);
    // const randomEnumValue = enumValues[randomIndex];
    return null;
}

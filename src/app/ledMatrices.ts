export interface IconDictionary {
    [iconName: string]: string | string[] | number[]
}

let ledMatrices: IconDictionary = {};

ledMatrices['empty'] = [
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000",
    "000000000"];

ledMatrices['musicNote'] = [
    "000000000",
    "001111100",
    "001111100",
    "001000100",
    "001000100",
    "001000100",
    "011001100",
    "111011100",
    "010001000"];

ledMatrices['lightBulb'] = [
    "000000000",
    "000111000",
    "001000100",
    "001000100",
    "001000100",
    "000111000",
    "000111000",
    "000111000",
    "000010000"];

ledMatrices['powerOn'] = [
    "000000000",
    "000000000",
    "000111000",
    "001111100",
    "001111100",
    "001111100",
    "000111000",
    "000000000",
    "000000000"];

ledMatrices['powerOff'] = [
    "000000000",
    "000000000",
    "000111000",
    "001000100",
    "001000100",
    "001000100",
    "000111000",
    "000000000",
    "000000000"];

ledMatrices['shuffle'] = [
    "000000000",
    "000000000",
    "011000110",
    "000101000",
    "000010000",
    "000101000",
    "011000110",
    "000000000",
    "000000000"];

ledMatrices['letterB'] = [
    "000000000",
    "000111000",
    "000100100",
    "000100100",
    "000111000",
    "000100100",
    "000100100",
    "000111000",
    "000000000"];

ledMatrices['letterO'] = [
    "000000000",
    "000111000",
    "001000100",
    "001000100",
    "001000100",
    "001000100",
    "001000100",
    "000111000",
    "000000000"];

ledMatrices['letterG'] = [
    "000000000",
    "000111000",
    "001000100",
    "001000000",
    "001011100",
    "001000100",
    "001000100",
    "000111000",
    "000000000"];

ledMatrices['letterW'] = [
    "000000000",
    "010000010",
    "010000010",
    "010000010",
    "010000010",
    "010010010",
    "010010010",
    "001101100",
    "000000000"];

ledMatrices['letterY'] = [
    "000000000",
    "001000100",
    "001000100",
    "000101000",
    "000010000",
    "000010000",
    "000010000",
    "000010000",
    "000000000"];

ledMatrices['play'] = [
    "000000000",
    "000100000",
    "000110000",
    "000111000",
    "000111100",
    "000111000",
    "000110000",
    "000100000",
    "000000000"];

ledMatrices['pause'] = [
    "000000000",
    "001101100",
    "001101100",
    "001101100",
    "001101100",
    "001101100",
    "001101100",
    "001101100",
    "000000000"];

ledMatrices['next'] = [
    "000000000",
    "000000000",
    "000100100",
    "000110100",
    "000111100",
    "000110100",
    "000100100",
    "000000000",
    "000000000"];

ledMatrices['previous'] = [
    "000000000",
    "000000000",
    "001001000",
    "001011000",
    "001111000",
    "001011000",
    "001001000",
    "000000000",
    "000000000"];

ledMatrices['questionMark'] = [
    "000111000",
    "001000100",
    "010000010",
    "000000100",
    "000001000",
    "000010000",
    "000010000",
    "000000000",
    "000010000"];

ledMatrices['bluetooth'] = [
    "000010000",
    "000011000",
    "001010100",
    "000111000",
    "000010000",
    "000111000",
    "001010100",
    "000011000",
    "000010000"];

ledMatrices['speaker'] = [
    "000000000",
    "000100010",
    "001101001",
    "111100101",
    "111100101",
    "111100101",
    "001101001",
    "000100010",
    "000000000"];


ledMatrices['mutedSpeaker'] = [
    "100000001",
    "010100010",
    "001101101",
    "111101101",
    "111110101",
    "111101101",
    "001101101",
    "010100010",
    "100000001"];

export default ledMatrices;
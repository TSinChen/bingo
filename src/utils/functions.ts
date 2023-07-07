import { BingoNumber } from './type';

export const removeArrayItemByIndex = <T>(arr: T[], index: number) => [
	...arr.slice(0, index),
	...arr.slice(index + 1),
];

export const generateRandomNumbers = (max: number) => {
	let numbers = Array.from({ length: max }, (_, i) => i + 1);
	const randomNumbers = [];
	for (let i = 0; i < max; i++) {
		const randomIndex = Math.floor(Math.random() * numbers.length);
		const randomNumber = numbers[randomIndex];
		numbers = removeArrayItemByIndex(numbers, randomIndex);
		randomNumbers.push(randomNumber);
	}
	return randomNumbers;
};

export const oneDimensionToTwoDimension = (
	arr: BingoNumber[],
	size: number
) => {
	const result: BingoNumber[][] = [];
	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];
		const box = result[Math.floor(i / size)];
		if (box) {
			box.push(item);
		} else {
			result.push([item]);
		}
	}
	return result;
};

export const isAllChecked = (arr: BingoNumber[]) =>
	arr.every((item) => item.selected);

export const findHorizontalLines = (
	arr: BingoNumber[],
	size: number
): number[] => {
	const lines = [];
	for (let i = 0; i < arr.length - size + 1; i += size) {
		if (isAllChecked(arr.slice(i, i + size))) {
			lines.push(i);
		}
	}
	return lines;
};

export const findVerticalLines = (
	arr: BingoNumber[],
	size: number
): number[] => {
	const lines = [];
	for (let i = 0; i < size; i++) {
		const targets: typeof arr = [];
		for (let j = i; j < arr.length; j += size) {
			targets.push(arr[j]);
		}
		if (isAllChecked(targets)) {
			lines.push(i);
		}
	}
	return lines;
};

export const findDiagonalLines = (
	arr: BingoNumber[],
	size: number
): number[] => {
	if (!arr.length) return [];
	const lines = [];
	const leftDiagonal: typeof arr = [];
	for (let i = 0; leftDiagonal.length < size; i += size + 1) {
		leftDiagonal.push(arr[i]);
	}
	const rightDiagonal: typeof arr = [];
	for (let i = size - 1; rightDiagonal.length < size; i += size - 1) {
		rightDiagonal.push(arr[i]);
	}

	if (isAllChecked(leftDiagonal)) lines.push(0);
	if (isAllChecked(rightDiagonal)) lines.push(size - 1);
	return lines;
};

export const isInLeftDiagonal = (index: number, size: number) => {
	const targets = [];
	for (let i = 0; targets.length < size; i += size + 1) {
		targets.push(i);
	}
	return targets.includes(index);
};

export const isInRightDiagonal = (index: number, size: number) => {
	const targets = [];
	for (let i = size - 1; targets.length < size; i += size - 1) {
		targets.push(i);
	}
	return targets.includes(index);
};

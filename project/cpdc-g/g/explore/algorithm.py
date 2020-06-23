class Solution:
    def minArray(self, numbers: [int]) -> int:
        i, j = 0, len(numbers) - 1
        while i < j:
            m = (i + j) // 2
            if numbers[m] > numbers[j]: i = m + 1
            elif numbers[m] < numbers[j]: j = m
            else: j -= 1
        return numbers[i]


if __name__ == '__main__':
    s = Solution()
    r = s.minArray([7,2,2,2,3,0,4])
    print('r:',r) # 2
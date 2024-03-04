#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numIndexMap;
    vector<int> result;

    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (numIndexMap.find(complement) != numIndexMap.end()) {
            result.push_back(numIndexMap[complement]);
            result.push_back(i);
            break;
        }
        numIndexMap[nums[i]] = i;
    }

    return result;
}

int main() {
    // Read input from user
    int n;
    cin >> n;

    vector<int> nums(n);
    for (int i = 0; i < n; ++i) {
        cin >> nums[i];
    }

    int target;
    cin >> target;

    // Find indices
    vector<int> indices = twoSum(nums, target);

    // Output result
    cout << "[";
    for (int i = 0; i < indices.size(); ++i) {
        cout << indices[i];
        if (i != indices.size() - 1) {
            cout << ",";
        }
    }
    cout << "]" << endl;

    return 0;
}

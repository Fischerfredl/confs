import unittest

from lib.fetch_data import fetch


class TestFetch(unittest.TestCase):
    def test_ux_2016(self):
        test = fetch('ux', 2016)
        self.assertGreater(len(test), 0)

    def test_javascript_2017(self):
        test = fetch('javascript', 2017)
        self.assertGreater(len(test), 0)


if __name__ == '__main__':
    unittest.main()
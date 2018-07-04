import unittest

from lib.calendar_name import calendar_name


class TestCalendarName(unittest.TestCase):
    def test_basics(self):
        self.assertEqual('Muperconfs - all Topics - all Countries', calendar_name(None, None))
        self.assertEqual('Muperconfs - Python, JavaScript - all Countries', calendar_name('python,javascript', None))
        self.assertEqual('Muperconfs - all Topics - Germany, U.S.A.', calendar_name(None, 'Germany,U.S.A.'))

    def test_many_values(self):
        self.assertEqual('Muperconfs - Python, JavaScript, CSS, ... - Germany, U.S.A.',
                         calendar_name('python,javascript,css,ux', 'Germany,U.S.A.'))
        self.assertEqual('Muperconfs - all Topics - Germany, U.S.A., France, ...',
                         calendar_name(None, 'Germany,U.S.A.,France,U.K.'))


if __name__ == '__main__':
    unittest.main()
from setuptools import setup

setup(
    name='ctab',
    version="0.1",
    author='Mario Balibrera',
    author_email='mario.balibrera@gmail.com',
    license='MIT License',
    description='c[rypto]t[rading]a[sset]b[alancer]',
    long_description='This package contains various components for monitoring and swapping tokens.',
    packages=[
        'ctab'
    ],
    zip_safe = False,
    install_requires = [

    ],
    entry_points = '''''',
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ],
)

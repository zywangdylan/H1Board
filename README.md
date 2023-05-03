# H1Board
## Introduction
With more and more people coming from foreign countries to the U.S for higher education and career development, H1B visa lottery and approval stats become a popular topic among more people every year. Unfortunately, obtaining proper work authorization through an H1-B visa can be a challenge for many international employees. As international students, we want to help our peers to obtain more insights into the influencing factors for the H1-B application process, especially on the visa approval rate, and also make proper recommendations on companies based on factors including but not limited to employee reviews, H1-B sponsorship, locations, salaries, etc.. The datasets we chose include various information, such as approval status and information of employees who applied for H1-B visa, along with employer information, work location, salary ranges, job title, etc.. We hope to combine and analyze the datasets, to learn more about what are the common factors that might influence the H1-B approval rate, which employees provide a friendly working environment for international workers, and if possible make recommendations for job-seeking international students based on our analysis results.

## Datasets
### [H1B Visa Data](https://www.kaggle.com/datasets/thedevastator/h-1b-non-immigrant-labour-visa)
This dataset contains information about the H-1B visas obtained by US employers to employ foreign workers in specialized roles, such as engineers, scientists and software developers. This data covers multiple aspects of the visa petition process, such as detailed information regarding the petitioners, their job titles and salaries and whether their applications were successful or not.

### [Company Job Reviews](https://www.kaggle.com/datasets/vaghefi/company-reviews)
The information in this dataset is scraped from Indeed.com website containing information about companies and their employees' ratings and happiness, location, salaries and a lot of other useful information.

## Folder Structure
**h1board-front**
The frontend codes of the project using React

**h1board-end**
The backend codes of the project using NodeJS & ExpressJS

## Deployment on AWS EC2 and DNS setup
We have deployed our web application on an EC2 instance on AWS and have also set up a domain name for it. The domain name is h1board.live.
The website is available on http://52.22.152.70/ and http://h1board.live

### EC2 Deployment
We chose to use EC2 as it provides scalable compute capacity in the cloud and allows us to easily deploy and manage our web application. To deploy our application on EC2, we followed the following steps:

1. Launched an EC2 instance on AWS and configured it to use the desired operating system and hardware resources.
2. Installed all the necessary dependencies and libraries required for running the application.
3. Uploaded the application code to the instance using SCP or any other file transfer mechanism.
4. Started the application server and ensured that it is listening to the correct port.

### Domain Name Setup
To set up a domain name for our web application, we followed these steps:

1. Purchased a domain name from a domain registrar such as Name.com.
2. Configured the DNS records of the domain name to point to the public IP address of the EC2 instance where our web application is deployed.
3. Configured the domain name to use the name servers provided by the domain registrar.
4. Once the DNS records were propagated, we were able to access our web application using the domain name h1board.live.

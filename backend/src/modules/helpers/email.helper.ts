export type DomainType = {
    name: string,
    emailName: string,
    protocol: string,
    supportEmail: string
}

export class EmailHelper {

    public static domains: DomainType[] = [
        {name: 'loveisahead', emailName: 'mg.loveisahead.com', protocol: 'https', supportEmail: 'info.datingweb@gmail.com'},
        {name: 'bestdatingever', emailName: 'mg.bestdatingever.com', protocol: 'https', supportEmail: 'info.datingweb@gmail.com'},
        {name: 'matchyoursecondhalf', emailName: 'mg.matchyoursecondhalf.com', protocol: 'https', supportEmail: 'info.datingweb@gmail.com'},
        {name: 'reallovesearch', emailName: 'mg.reallovesearch.com', protocol: 'https', supportEmail: 'info.datingweb@gmail.com'},
        {name: 'localhost', emailName: 'mg.loveisahead.com', protocol: 'http', supportEmail: 'info.datingweb@gmail.com'},
    ]

    public static getEmailDomain(domainName: string): DomainType {

        let result = EmailHelper.domains.find(item => item.name.match(new RegExp(domainName, 'gm')));

        if(!result) result = EmailHelper.domains[0]

        return result;
    }

    public static generateUrl(data: DomainType, domainName: string): string {
        const protocol = (domainName == 'loveisahead.loc') ? 'http' : data.protocol
        return `${protocol}://${domainName}`;
    }
}

